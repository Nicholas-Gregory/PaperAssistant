export default function Card({ card }) {
    return (
        <div
            className="card"
            style={{
                width: card.scale.x,
                height: card.scale.y,
                position: 'absolute',
                top: card.position.y,
                left: card.position.x
            }}
        >
            {card.content.map(c => c.text)}
        </div>
    )
}