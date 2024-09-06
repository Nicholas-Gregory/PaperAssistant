import { useRef, useState } from "react";
import ContentBox from "./ContentBox";
import MessageInputBox from "./MessageInputBox";
import { apiCall, claudeApiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";

export default function Context({ }) {
    const [context, setContext] = useState([]);
    const [contextNameInput, setContextNameInput] = useState('');
    const [error, setError] = useState(null);
    const modalRef = useRef();
    const { authorize, user, setUser } = useAuth();

    async function handleSay(userText) {
        const response = await claudeApiCall({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 5000,
            messages: [
                ...context.map(c => ({ role: c.role, content: c.content })),
                { role: 'user', content: [{ type: 'text', text: userText }] }
            ]
        });

        setContext([
            ...context, 
            { role: 'user', content: [{ type: 'text', text: userText }] },
            response
        ]);
    }

    function handleSaveContextClick() {
        modalRef.current.showModal();
    }

    async function handleNameSubmit(e) {
        e.preventDefault();

        const response = await apiCall('POST', '/context', {
            contentItems: context
        }, authorize());

        if (response.error) {
            setError(response.type);
        } else {
            setUser({
                ...user,
                contexts: [
                    ...user.contexts,
                    response
                ]
            });
        }

        modalRef.current.close();
    }

    return (
        <>
            <dialog ref={modalRef}>
                <p>
                    Name the Context:
                </p>
                <form id="context-name-form">
                    <input
                        type="text"
                        placeholder="Context Name"
                        value={contextNameInput}
                        onChange={e => setContextNameInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        onClick={handleNameSubmit}
                    >
                        Submit
                    </button>
                </form>
            </dialog>
            {context.length > 0 && (
                <button
                    onClick={handleSaveContextClick}
                >
                    Save Context
                </button>
            )}
            {context.map(content => (
                <ContentBox
                    role={content.role}
                    content={content.content}
                />
            ))}
            <MessageInputBox onSay={handleSay}/>
            {error && (
                <p>
                    {error}
                </p>
            )}
        </>
    )
}