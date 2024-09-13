import { useEffect, useRef } from "react"
import ContentEditable from "react-contenteditable";

export default function MessageInputBox({ onSay }) {
    const text = useRef('');
    const messageBoxRef = useRef();

    async function handleMessageSubmit() {
        onSay(text.current);
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
                    display: 'flex'
                }}
            >
                <ContentEditable
                    html={text.current}
                    onChange={e => text.current = e.target.value}
                    style={{ flex: 7 }}
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