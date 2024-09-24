import { useState } from "react";

export default function Topbar({
    id,
    onGrab,
    onRelease,
    onOptionsClick,
    children
}) {
    const [backgroundColor, setBackgroundColor] = useState('dimgray');
    const [showOptions, setShowOptions] = useState(false);

    function handleGrab(event) {
        onGrab(event, id);
        setBackgroundColor('darkslategray');
    }

    function handleRelease() {
        onRelease(id);
        setBackgroundColor('dimgray');
    }

    return (
        <div
            className="clickable card"
            onMouseDown={handleGrab}
            onMouseUp={handleRelease}
            style={{
                backgroundColor,
                height: '20px',
                cursor: 'grab'
            }}
        >
            <span>✥</span>
            {children}
            <button 
                onMouseDown={e => e.stopPropagation()}
                onClick={onOptionsClick}
                style={{ float: 'right' }}
            >
                ...
            </button>
        </div>
    )
}