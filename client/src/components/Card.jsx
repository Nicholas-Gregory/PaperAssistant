import { getBackgroundColor } from '../utils'

export default function Card({ 
    position, 
    scale, 
    type,
    children
}) {
    return (
        <>
            <div
                className="card"
                style={{
                    width: scale.x,
                    height: scale.y,
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    backgroundColor: getBackgroundColor(type)
                }}
            >
                {children}
            </div>
        </>
    )
}