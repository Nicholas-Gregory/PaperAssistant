import { useState } from "react";
import ContentBox from "./ContentBox";
import MessageInputBox from "./MessageInputBox";
import { claudeApiCall } from "../utils";

export default function Context({ }) {
    const [context, setContext] = useState([]);

    async function handleSay(userText) {
        const response = await claudeApiCall({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 5000,
            messages: [
                ...context.map(c => ({ role: c.role, content: c.content })),
                { role: 'user', content: userText }
            ]
        });

        setContext([
            ...context, 
            { role: 'user', content: userText },
            response
        ]);
    }

    return (
        <>
            {context.map(content => (
                <ContentBox
                    role={content.role}
                    content={content.content}
                />
            ))}
            <MessageInputBox onSay={handleSay}/>
        </>
    )
}