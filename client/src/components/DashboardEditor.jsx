import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Card from "./Card";
import MessageInput from './MessageInput';
import { apiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";

const DashboardEditor = forwardRef(function DashboardEditor({ dashboard }, ref) {
    const [cards, setCards] = useState([]);
    const [cardScaleAndPosition, setCardScaleAndPosition] = useState([]);
    const { authorize } = useAuth();

    useEffect(() => {
        if (dashboard) {
            // Populate cards with the flattened full tree
            // Children and parent fields populated with object references
            function makeReferences(node, parent) {
                const card = {
                    role: node.role,
                    content: node.content,
                    parent
                };

                card.children = node.children.map(child => (
                    makeReferences(child, node)
                ));

                setCards(cards => [...cards, card]);

                return card;
            }

            for (let rootContext of dashboard.contexts) {
                makeReferences(rootContext);
            }
        }
    }, [dashboard]);

    useEffect(() => {
        setCardScaleAndPosition(initScaleAndPosition(cards));
    }, [cards]);

    useImperativeHandle(ref, () => {
        return {
            getCards: () => cards
        }
    }, [cards]);

    function getContentArray(content) {
        return [{ type: 'text', text: content }];
    }

    async function getClaudeResponse(messages) {
        const response = await apiCall('POST', '/claude', {
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 2048,
            messages
        }, authorize());

        return response;
    }

    async function sayWithContext(leafCard, content) {
        const newUserCard = { role: 'user', content: getContentArray(content) }
        const messages = [newUserCard];
        let currentCard = leafCard;

        while (currentCard) {
            messages.unshift({
                role: currentCard.role,
                content: currentCard.content.map(content => ({
                    type: content.type,
                    text: content.text
                }))
            });

            currentCard = currentCard.parent;
        }

        const response = await getClaudeResponse(messages);

        const newAssistantCard = {
            role: 'assistant',
            content: response.content,
            parent: newUserCard,
            children: []
        }

        newUserCard.parent = leafCard;
        newUserCard.children = [newAssistantCard];

        const newCards = [
            ...cards.toSpliced(-1, 1, {
                ...leafCard,
                children: [...leafCard.children, newAssistantCard]
            }), 
            newUserCard, 
            newAssistantCard
        ];

        setCardScaleAndPosition(initScaleAndPosition(newCards));
        setCards(newCards);
    }

    async function handleNewContextSubmit(content) {
        const contentArray = getContentArray(content);
        const response = await getClaudeResponse([{ role: 'user', content: contentArray }]);

        const firstAssistantCard = { 
            role: 'assistant', 
            content: response.content,
            children: []
        };
        const firstUserCard = { 
            role: 'user', 
            content: contentArray
        };
        firstAssistantCard.parent = firstUserCard;
        firstUserCard.children = [firstAssistantCard];

        setCards([...cards, firstUserCard, firstAssistantCard]);
    }

    function initScaleAndPosition(cards) {
        const results = [];
        const rootCards = [];

        // Figure out what's a root and init scale for every card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (!card.parent) rootCards.push(card);
            if (!results[i]) {
                results[i] = {};

                if (!results[i].scale) {
                    results[i].scale = { x: 400, y: 200 }
                }
            }
        }

        // Position everything based on root cards
        for (let i = 0; i < rootCards.length; i++) {
            const rootCard = rootCards[i];
            const getResult = queryCard => results[cards.findIndex(card => card === queryCard)];
            const rootResult = getResult(rootCard);

            if (!rootResult.position) {
                rootResult.position = { x: 0, y: 0 };

                for (let j = 0; j < i; j++) {
                    const previousRootResult = getResult(rootCards[j]);
                    rootResult.position += previousRootResult.position.x + previousRootResult.scale.x;
                }
            }

            function positionChildren(node) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const childResult = getResult(child);

                    if (!childResult.position) {
                        const parentResult = getResult(node);

                        childResult.position = { x: 0, y: parentResult.position.y + parentResult.scale.y };
                    }

                    positionChildren(child)
                }
            }

            positionChildren(rootCard);
        }
     
        return results
    }

    return (
        <div 
            style={{ 
                margin: '5px',
                position: 'relative'
            }}
        >
            {cards.length === 0 && (
                <MessageInput 
                    width={'50%'}
                    position={{ x: 0, y: 0 }}
                    onSubmit={handleNewContextSubmit}
                />
            )}
            {cardScaleAndPosition.length > 0 && (
                cards.map((card, index) => (
                    <Card 
                        key={index}
                        card={card}
                        position={cardScaleAndPosition[index]?.position}
                        scale={cardScaleAndPosition[index]?.scale} 
                    />
                )
            ))}
            {cardScaleAndPosition.length > 0 && (
                cards.reduce((array, card, index) => card.children.length === 0 ? (
                    [
                        ...array,
                        <MessageInput
                            key={index}
                            width={cardScaleAndPosition[index]?.scale.x}
                            position={{
                                x: cardScaleAndPosition[index]?.position.x,
                                y: cardScaleAndPosition[index]?.position.y + cardScaleAndPosition[index]?.scale.y
                            }}
                            onSubmit={content => sayWithContext(card, content)}
                        />
                    ]
                ) : array, []
            ))}
        </div>
    )
});

export default DashboardEditor;