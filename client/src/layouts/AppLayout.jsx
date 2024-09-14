import { Link, Outlet } from 'react-router-dom'

export default function AppLayout() {
    return (
        <>
            App Layout
            <br />
            <Link to={'/app/dashboard'}>Dashboard</Link>
            <Link to='/app/settings'>Settings</Link>
            <br />
            <Outlet />
        </>
    )
}