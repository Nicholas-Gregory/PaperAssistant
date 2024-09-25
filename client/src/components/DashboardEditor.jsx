import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Card from "./Card";
import { apiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";
import NewCard from "./NewCard";
import { useSettings } from "../contexts/SettingsContext";
import Topbar from "./Topbar";
import OptionsMenu from "./OptionsMenu";
import OptionsMenuButton from "./OptionsMenuButton";
import Markdown from 'markdown-to-jsx';
import ServerError from './ServerError';

const DashboardEditor = forwardRef(function DashboardEditor({ dashboard }, ref) {
    const [cards, setCards] = useState([]);
    const [newContextPosition, setNewContextPosition] = useState(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
    const [showOptions, setShowOptions] = useState({});
    const [namingCard, setNamingCard] = useState({});
    const [branching, setBranching] = useState([]);
    const [deleting, setDeleting] = useState({});
    const [error, setError] = useState(null);
    const { authorize } = useAuth();
    const containerDivRef = useRef();

    useEffect(() => {
        for (let card of cards) {
            setShowOptions(showOptions => ({
                ...showOptions,
                [card._id]: false
            }));
        }
    }, [cards]);

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
            scale: initScale(content),
            dashboard: dashboard._id
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
                y: parent.position.y + parent.scale.y + 10
            },
            scale: initScale(content),
            parent: parent._id,
            dashboard: dashboard._id
        };
        const { newClaudeCard, newUserCard } = await apiCall('POST', '/claude', newUserCardData, authorize());

        parent.children = [...parent.children, newUserCard._id];

        setCards([...cards, newUserCard, newClaudeCard]);
    }

    function handleOptionsClick(cardId) {
        setShowOptions({
            ...showOptions,
            [cardId]: !showOptions[cardId]
        });
        setDeleting({
            ...deleting,
            [cardId]: false
        });
    }

    function handleGrab(cardId) {

    }

    function handleRelease(cardId) {

    }

    function handleOptionClick(cardId, optionId) {
        const card = cards.find(card => card._id === cardId);

        if (optionId === 'name') {
            setShowOptions({
                ...showOptions,
                [cardId]: false
            });
            setNamingCard({
                ...namingCard,
                [cardId]: card.name || ''
            });
        } else if (optionId === 'branch') {
            setShowOptions({
                ...showOptions,
                [cardId]: false
            });
            !branching.includes(cardId) && setBranching([...branching, cardId]);
        } else if (optionId === 'delete') {
            setDeleting({
                ...deleting,
                [cardId]: true
            });
        }
    }

    async function handleNameSaveClick(cardId) {
        const response = await apiCall('PUT', `/card/${cardId}`, {
            name: namingCard[cardId]
        }, authorize());

        if (response.error) {
            setError(response.type);
            return;
        }

        setCards(cards.map(card => (
            card._id === cardId ? (
                response
            ): card
        )));
        setNamingCard({
            ...namingCard,
            [cardId]: false
        });
    }

    async function handleBranchSubmit(content, card) {
        const newUserCardData = {
            ...content,
            position: {
                
            }
        }
    }

    async function handleDeleteOptionClick(cardId, optionId) {

    }

    return (
        <>
            <ServerError 
                error={error}
                messageMap={{
                    AuthenticationError: "Must be logged in!"
                }}
            />
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
                {branching.map(cardId => {
                    const card = cards.find(card => card._id === cardId);

                    return (
                        <NewCard
                            width={card.scale.x}
                            position={{
                                x: card.position.x + card.scale.x + 15,
                                y: card.position.y + card.scale.y - canvasTop()
                            }}
                            onSubmit={content => handleBranchSubmit(content, card)}
                        />
                    )
                })}
                {cards.map(card => (
                    <>
                        <Card 
                            position={{
                                x: card.position.x,
                                y: card.position.y - canvasTop()
                            }}
                            scale={card.scale}
                            type={card.type}
                        >
                            <Topbar
                                onGrab={() => handleGrab(card._id)} 
                                onRelease={() => handleRelease(card._id)}
                                onOptionsClick={() => handleOptionsClick(card._id)}
                            >
                                &nbsp; {namingCard[card._id] || namingCard[card._id] === '' ? (
                                    <>
                                        <input
                                            type="text"
                                            value={namingCard[card._id]}
                                            onChange={e => setNamingCard({
                                                ...namingCard,
                                                [card._id]: e.target.value
                                            })}
                                        />
                                        &nbsp;
                                        <button 
                                            onClick={() => handleNameSaveClick(card._id)}
                                            onMouseDown={e => e.stopPropagation()}
                                        >
                                            Save Name
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {card.name}
                                    </>
                                )}
                            </Topbar>
                            <div 
                                style={{ 
                                    overflowY: 'auto', 
                                    height: card.scale.y - 50
                                }}
                            >
                                <Markdown>
                                    {card.content}
                                </Markdown>
                            </div>
                        </Card>
                        <OptionsMenu
                            showOptions={showOptions[card._id]}
                            position={{
                                x: card.position.x + card.scale.x + 13,
                                y: card.position.y - canvasTop()
                            }}
                            onClick={id => handleOptionClick(card._id, id)}
                        >
                            <OptionsMenuButton id={'edit'}>
                                <div className='clickable card'>
                                    Edit
                                </div>
                            </OptionsMenuButton>
                            <OptionsMenuButton id={'branch'}>
                                <div className='clickable card'>
                                    Branch
                                </div>
                            </OptionsMenuButton>
                            <OptionsMenuButton id={'name'}>
                                <div className='clickable card'>
                                    Name
                                </div>
                            </OptionsMenuButton>
                            <OptionsMenuButton id={'delete'}>
                                <div className="clickable card">
                                    Delete
                                </div>
                            </OptionsMenuButton>
                        </OptionsMenu>
                        <OptionsMenu
                            showOptions={deleting[card._id]}
                            position={{
                                x: card.position.x + card.scale.x + 13 + 80,
                                y: card.position.y + 117 - canvasTop()
                            }}
                            onClick={id => handleDeleteOptionClick(card._id, id)}
                        >
                            <OptionsMenuButton id={'delete-card'}>
                                <div className="clickable card">
                                    Card
                                </div>
                            </OptionsMenuButton>
                            <OptionsMenuButton id={'delete-tree'}>
                                <div className="clickable card">
                                    Tree
                                </div>
                            </OptionsMenuButton>
                        </OptionsMenu>
                    </>
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
        </>
    )
});

export default DashboardEditor;