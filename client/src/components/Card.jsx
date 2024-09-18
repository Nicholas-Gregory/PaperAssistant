import Markdown from 'markdown-to-jsx'

export default function Card({ card }) {
    return (
        <div
            className="card"
            style={{
                width: card.scale.x,
                height: card.scale.y,
                position: 'absolute',
                top: card.position.y,
                left: card.position.x,
                overflowY: 'scroll'
            }}
        >
            {card.content.map(c => (
                <Markdown>
                    {c.text}
                </Markdown>
            ))}
        </div>
    )
}