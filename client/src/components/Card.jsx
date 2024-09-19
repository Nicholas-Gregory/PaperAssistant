import Markdown from 'markdown-to-jsx'

export default function Card({ content, position, scale }) {
    return (
        <div
            className="card"
            style={{
                width: scale.x,
                height: scale.y,
                position: 'absolute',
                top: position.y,
                left: position.x,
                overflowY: 'scroll'
            }}
        >
            <Markdown>
                {content}
            </Markdown>
        </div>
    )
}