import { useRef, useState } from "react"
import { claudeApiCall } from "../utils";
import ContentEditable from "react-contenteditable";

export default function MessageInputBox({ onSay }) {
    const text = useRef('');

    async function handleMessageButtonClick() {
        onSay(text.current);
        text.current = '';
    }

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