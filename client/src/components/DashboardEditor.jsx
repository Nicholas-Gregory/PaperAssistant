import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Card from "./Card";
import MessageInput from './MessageInput';
import { apiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";

const DashboardEditor = forwardRef(function DashboardEditor({ dashboard }, ref) {
    const [cards, setCards] = useState([]);
    const { authorize } = useAuth();

    useEffect(() => {
        // Populate cards with the serialized full tree
        // children and parent fields populated with references
        
    }, [dashboard])

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
                content: currentCard.content
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

        setCards(cards => [...cards, newUserCard, newAssistantCard]);
        setCards(cards => cards.map(card => (
            card === leafCard ? (
                {
                    ...leafCard,
                    children: [...leafCard.children, newAssistantCard]
                }
            ) : card
        )));
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

    function renderContexts() {
        const results = [];
        const rootCards = [];

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (!card.scale) {
                card.scale = { x: 400, y: 200 }
            }

            if (!card.position) {
                if (card.parent) {
                    const { x: parentX, y: parentY } = card.parent.position;
            
                    card.position = {
                        x: parentX,
                        y: parentY + card.parent.scale.y
                    }
                } else {
                    card.position = {
                        x: rootCards.reduce((positionValue, card) => positionValue + card.position.x + card.scale.x, 0),
                        y: 0
                    }
                }
            }

            results.push(<Card key={i} card={card} />);
        }

        return results;
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
            {renderContexts()}
            {cards.reduce((array, card, index) => card.children.length === 0 ? (
                [
                    ...array,
                    <MessageInput
                        key={index}
                        width={card.scale.x}
                        position={{
                            x: card.position.x,
                            y: card.position.y + card.scale.y
                        }}
                        onSubmit={content => sayWithContext(card, content)}
                    />
                ]
            ) : array, [])}
        </div>
    )
});

export default DashboardEditor;