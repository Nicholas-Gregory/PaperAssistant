import ContentEditable from 'react-contenteditable';
import { useEffect, useRef } from 'react';

export default function NewMessageBox({ 
    width,
    position,
    onSubmit
}) {
    const text = useRef('');
    const messageBoxRef = useRef();

    async function handleMessageSubmit() {
        onSubmit(text.current);
        text.current = '';
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

    return (
        <>
            <div
                className="card"
                style={{
                    minHeight: '20px',
                    width: width,
                    display: 'flex',
                    position: 'absolute',
                    top: position.y,
                    left: position.x
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
            </div>
        </>
    )
}