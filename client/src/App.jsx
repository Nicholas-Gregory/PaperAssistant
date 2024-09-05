import { useEffect } from "react";
import { useState } from "react";
import { claudeApiCall } from "./utils";

export default function App() {
    const [response, setResponse] = useState('');

    useEffect(() => {
        claudeApiCall({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 8192,
            messages: [{ role: 'user', content: 'Hi Claude, just testing out the API. Say whatever you want!'}]
        }).then(res => setResponse(res.content[0].text))
    }, []);

    return (
        <p>{response}</p>
    )
}