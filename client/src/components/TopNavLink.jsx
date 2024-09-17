import { NavLink } from 'react-router-dom'

export default function TopNavLink({ to, children }) {
    return (
        <NavLink 
            to={to} 
            style={({ isActive }) => ({
                backgroundColor: isActive ? 'gray' : 'silver',
                borderRadius: '5px',
                padding: '5px'
            })}
        >
            {children}
        </NavLink>
    )
}