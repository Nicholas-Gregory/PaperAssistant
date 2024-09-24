import Markdown from 'markdown-to-jsx'
import { getBackgroundColor } from '../utils'

export default function Card({ 
    content, 
    position, 
    scale, 
    type 
}) {


    return (
        <div
            className="card"
            style={{
                width: scale.x,
                height: scale.y,
                position: 'absolute',
                top: position.y,
                left: position.x,
                overflowY: 'scroll',
                backgroundColor: getBackgroundColor(type)
            }}
        >
            <Markdown>
                {content}
            </Markdown>
        </div>
    )
}