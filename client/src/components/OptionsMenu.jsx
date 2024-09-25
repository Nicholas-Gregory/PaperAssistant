import React, { useContext } from "react"

const OptionsMenuContext = React.createContext();

export function useOptionsContext() {
    return useContext(OptionsMenuContext);
}

export default function OptionsMenu({
    showOptions,
    position,
    onClick,
    children
}) {
    return (
        <OptionsMenuContext.Provider value={{ showOptions, onClick }}>
            <div
                className="card"
                style={{
                    opacity: `${showOptions ? '1' : '0'}`,
                    transition: 'opacity 0.5s',
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    zIndex: 1,
                    backgroundColor: 'white'
                }}
            >
                {children}
            </div>
        </OptionsMenuContext.Provider>
    )
}