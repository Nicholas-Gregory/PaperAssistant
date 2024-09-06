export default function ContentBox({ role, content }) {
    return (
        <>
            <div
                className="box"
                style={{
                    backgroundColor: role === 'assistant' ? 'lightseagreen' : 'lightskyblue',
                }}
            >   
                {Array.isArray(content) ? (
                    content.map(item => (
                        item.type === 'text' ? (
                            <div>
                                {item.text}
                            </div>
                        ) : (
                            <img />
                        )
                    ))
                ) : (
                    content
                )}
            </div>
        </>
    )
}