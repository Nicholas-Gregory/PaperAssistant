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
    const [{ model, max_tokens }] = useSettings();

    useEffect(() => {
        if (dashboard) {
            setCards(...dashboard.cards);
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

    const canvasTop = () => containerDivRef.current.getBoundingClientRect().top;

    function handleCanvasClick(e) {
        if (newContextPosition) {
            setNewContextPosition(null);
        } else {
            setNewContextPosition({ x: e.clientX, y: e.clientY });
        }
    }

    async function handleNewCardSubmit(content) {
        const newUserCard = {
            ...content,
            position: {
                x: newContextPosition.x,
                y: newContextPosition.y
            },
            scale: {
                x: 400, y: 200
            }
        };
        const newClaudeCard = await apiCall('POST', '/claude', newUserCard, authorize());

        setCards([...cards, newUserCard, newClaudeCard]);

        setNewContextPosition(null);
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
            <canvas
                onClick={handleCanvasClick}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
            ></canvas>
        </div>
    )
});

export default DashboardEditor;