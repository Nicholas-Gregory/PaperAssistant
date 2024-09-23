import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Card from "./Card";
import { apiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";
import NewCard from "./NewCard";
import { useSettings } from "../contexts/SettingsContext";

const DashboardEditor = forwardRef(function DashboardEditor({ dashboard }, ref) {
    const [cards, setCards] = useState([]);
    const [newContextPosition, setNewContextPosition] = useState(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const { authorize } = useAuth();
    const containerDivRef = useRef();

    useEffect(() => {
        if (dashboard) {
            setCards([...dashboard.cards]);
        } else {
            setCards([]);
        }
    }, [dashboard]);

    useEffect(() => {
        if (containerDivRef.current) {
            setCanvasDimensions({
                width: window.innerWidth,
                height: window.innerHeight - canvasTop()
            });
        }
    }, [containerDivRef.current, window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const listener = e => e.key === 'Escape' && setNewContextPosition(null);

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, [])

    useImperativeHandle(ref, () => {
        return {
            getCards: () => [cards, setCards]
        }
    }, [cards]);

    const canvasTop = () => containerDivRef.current.getBoundingClientRect().top + window.scrollY;

    function handleCanvasClick(e) {
        if (newContextPosition) {
            setNewContextPosition(null);
        } else {
            setNewContextPosition({ x: e.clientX, y: e.clientY });
        }
    }

    function initScale(content) {
        return { x: 400, y: 200 };
    }

    async function handleNewCardSubmit(content) {
        const newUserCardData = {
            ...content,
            position: {
                x: newContextPosition.x,
                y: newContextPosition.y
            },
            scale: initScale(content)
        };
        const { newClaudeCard, newUserCard } = await apiCall('POST', '/claude', newUserCardData, authorize());

        setCards([...cards, newUserCard, newClaudeCard]);
        setNewContextPosition(null);
    }

    async function handleContextCardSubmit(content, parent) {
        const newUserCardData = {
            ...content,
            position: {
                x: parent.position.x,
                y: parent.position.y + parent.scale.y
            },
            scale: initScale(content),
            parent: parent._id
        };
        const { newClaudeCard, newUserCard } = await apiCall('POST', '/claude', newUserCardData, authorize());

        parent.children = [...parent.children, newUserCard._id];

        setCards([...cards, newUserCard, newClaudeCard]);
    }

    return (
        <div 
            ref={containerDivRef}
            style={{ 
                margin: '5px',
                position: 'relative'
            }}
        >
            {newContextPosition && (
                <NewCard 
                    width={400}
                    position={{
                        x: newContextPosition.x,
                        y: newContextPosition.y - canvasTop()
                    }}
                    onSubmit={handleNewCardSubmit}
                />
            )}
            {cards.map(card => (
                <Card 
                    content={card.content}
                    position={{
                        x: card.position.x,
                        y: card.position.y - canvasTop()
                    }}
                    scale={card.scale}
                />
            ))}
            {cards.reduce((array, card) => (
                card.children.length === 0 ? (
                    [
                        ...array, 
                        <NewCard
                            width={card.scale.x}
                            position={{
                                x: card.position.x,
                                y: card.position.y + card.scale.y - canvasTop()
                            }}
                            onSubmit={content => handleContextCardSubmit(content, card)}
                        />
                    ]
                ): array
            ), [])}
            <canvas
                onClick={handleCanvasClick}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
            ></canvas>
        </div>
    )
});

export default DashboardEditor;