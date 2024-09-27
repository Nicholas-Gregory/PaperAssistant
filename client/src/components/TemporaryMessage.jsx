import { useEffect, useState } from "react";

export default function TemporaryMessage({ message }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        setTimeout(() => setVisible(false), 1000);
    }, [message]);

    return (
        <>
            <p 
                style={{
                    opacity: visible ? 1 : 0,
                    userSelect: visible ? 'auto' : 'none',
                    transition: 'opacity 1s'
                }}
            >
                {message}
            </p>
        </>
    )
}