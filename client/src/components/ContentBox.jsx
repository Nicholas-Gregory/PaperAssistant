import BoxTopbar from "./BoxTopbar";

export default function ContentBox({ 
    position,
    scale,
    backgroundColor,
    children
}) {

    return (
        <>
            <span
                className="card"
                style={{
                    width: `${scale.x}px`,
                    height: `${scale.y}px`,
                    position: 'absolute',
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    backgroundColor,
                }}
            >
                {children}
            </span>
        </>
    )
}