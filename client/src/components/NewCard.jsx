import ContentEditable from 'react-contenteditable';
import { useEffect, useRef, useState } from 'react';
import { getBackgroundColor } from '../utils';

export default function NewCard({ 
    width,
    position,
    onSubmit
}) {
    const text = useRef('');
    const messageBoxRef = useRef();
    const messageInputCardRef = useRef();
    const [showOptions, setShowOptions] = useState(false);
    const [type, setType] = useState('user');

    function handleMessageSubmit() {
        const content = text.current;
        text.current = '';

        onSubmit({ type, content });
    }

    useEffect(() => {
        const listener = e => {
            if (e.key === 'Enter' && !e.shiftKey && document.activeElement === messageBoxRef.current) {
                e.preventDefault();

                handleMessageSubmit();
            }
        }

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, [handleMessageSubmit]);

    function handleOptionsClick() {
        setShowOptions(!showOptions);
    }

    function handleTypeOptionClick(type) {
        if (showOptions) {
            setType(type);
            setShowOptions(false);
        }
    }

    return (
        <>
            <div
                ref={messageInputCardRef}
                className="card"
                style={{
                    minHeight: '20px',
                    width: width,
                    display: 'flex',
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    backgroundColor: getBackgroundColor(type)
                }}
            >
                <ContentEditable
                    html={text.current}
                    onChange={e => text.current = e.target.value}
                    style={{ 
                        flex: 7,
                        overflow: 'auto'
                    }}
                    innerRef={messageBoxRef}
                />
                &nbsp;
                <button 
                    onClick={handleMessageSubmit}
                    style={{ 
                        flex: 1, 
                        maxHeight: '20px',
                    }}
                >
                    Say
                </button>
                &nbsp;
                <button onClick={handleOptionsClick}>
                    ...
                </button>
            </div>
            <div
                className='card'
                style={{
                    opacity: `${showOptions ? '1' : '0'}`,
                    transition: 'opacity 0.5s',
                    position: 'absolute',
                    top: position.y,
                    left: messageInputCardRef.current?.getBoundingClientRect().right
                }}
            >
                <div 
                    className='clickable card'
                    onClick={() => handleTypeOptionClick('user')}
                >
                    User
                </div>
                <div 
                    className='clickable card'
                    onClick={() => handleTypeOptionClick('assistant')}
                >
                    Assistant
                </div>
                <div 
                    className='clickable card'
                    onClick={() => handleTypeOptionClick('system')}
                >
                    System
                </div>
                <div 
                    className='clickable card'
                    onClick={() => handleTypeOptionClick('note')}
                >
                    Note
                </div>
            </div>
        </>
    )
}