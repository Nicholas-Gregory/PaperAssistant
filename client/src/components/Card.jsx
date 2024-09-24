import Markdown from 'markdown-to-jsx'
import { getBackgroundColor } from '../utils'
import Topbar from './Topbar'
import OptionsMenu from './OptionsMenu';
import { useState } from 'react';
import OptionsMenuButton from './OptionsMenuButton';

export default function Card({ 
    content, 
    position, 
    scale, 
    type,
    id,
    name
}) {
    const [showOptions, setShowOptions] = useState(false);

    function handleGrab(event, id) {

    }

    function handleRelease(id) {

    }

    function handleOptionsClick(id) {
        if (id === 'edit') {

        }
    }

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
                    overflowY: 'scroll',
                    backgroundColor: getBackgroundColor(type)
                }}
            >
                <Topbar 
                    id={id} 
                    name={name} 
                    onGrab={handleGrab} 
                    onRelease={handleRelease}
                    onOptionsClick={() => setShowOptions(!showOptions)}
                />
                <Markdown>
                    {content}
                </Markdown>
            </div>
            <OptionsMenu
                showOptions={showOptions}
                position={{
                    x: position.x + scale.x + 13,
                    y: position.y
                }}
                onClick={handleOptionsClick}
            >
                <OptionsMenuButton id={'edit'}>
                    <div className='clickable card'>
                        Edit
                    </div>
                </OptionsMenuButton>
                <OptionsMenuButton id={'branch'}>
                    <div className='clickable card'>
                        Branch
                    </div>
                </OptionsMenuButton>
            </OptionsMenu>
        </>
    )
}