export default function ServerError({ messageMap={}, error }) {
    return (
        <>
            {error && (
                <p>
                    {messageMap[error] || error}
                </p>
            )}
        </>
    )
}