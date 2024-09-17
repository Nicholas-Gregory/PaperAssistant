export default function TopNav({ children }) {
    return (
        <nav
            style={{
                backgroundColor: 'silver',
                borderBottom: 'thin solid black',
                padding: '8px'
            }}
        >
            {children}
        </nav>
    )
}