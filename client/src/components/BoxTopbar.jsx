import { useState } from "react";

export default function BoxTopbar({ 
    id,
    name,
    onSave,
    onGrab,
    backgroundColor
}) {
    function handleSaveButtonClick(e) {
        e.stopPropagation();
        onSave(id);
    }

    function handleGrab(e) {
        onGrab(e, id);
    }

    return (
        <div
            onMouseDown={handleGrab}
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