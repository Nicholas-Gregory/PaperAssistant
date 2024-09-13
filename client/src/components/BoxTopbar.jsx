import { useState } from "react";

export default function BoxTopbar({ 
    id,
    name,
    onSave,
    onGrab,
    onRelease
}) {
    const [backgroundColor, setBackgroundColor] = useState('aqua');

    function handleSaveButtonClick(e) {
        e.stopPropagation();
        onSave(id);
    }

    function handleGrab(e) {
        onGrab(e, id);
        setBackgroundColor('darkcyan')
    }

    function handleRelease() {
        onRelease(id);
        setBackgroundColor('aqua');
    }

    return (
        <div
            onMouseDown={handleGrab}
            onMouseUp={handleRelease}
            style={{
                backgroundColor,
                height: '20px',
                borderRadius: '5px',
                cursor: 'grab'
            }}
        >
            <button
                style={{ 
                    float: "right",
                    height: '20px',
                    backgroundColor,
                    border: 'none'
                }}
                onClick={handleSaveButtonClick}
            >
                💾
            </button>
            <span style={{ cursor: 'grab' }}>✥</span>
            {name}
        </div>
)
}