import { useEffect, useRef } from "react"
import ContentEditable from "react-contenteditable";

export default function MessageInputBox({ onSay }) {
    const text = useRef('');
    const messageBoxRef = useRef();

    async function handleMessageButtonClick() {
        onSay(text.current);
        text.current = '';
    }

    useEffect(() => {
        const listener = e => {
            if (e.key === 'Enter' && !e.shiftKey && document.activeElement === messageBoxRef.current) {
                e.preventDefault();

                handleMessageButtonClick();
            }
        }

        window.addEventListener('keydown', listener);

        return () => window.removeEventListener('keydown', listener);
    }, [handleMessageButtonClick]);

    return (
        <>
            <div
                className="box"
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
                    onClick={handleMessageButtonClick}
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