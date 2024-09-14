import { Link, Outlet } from 'react-router-dom'

export default function Main() {
    return (
        <>
            Main Layout 
            <br />
            <Link to={'/home'}>Home</Link>
            <Link to={'/app'}>App</Link>
            <Link to={'/user'}>User</Link>
            <br />
            <Outlet />
        </>
    )
}