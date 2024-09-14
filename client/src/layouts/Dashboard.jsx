import { Link, Outlet } from 'react-router-dom'

export default function Dashboard() {
    return (
        <>
            Dahsboard Layout
            <Link to='/app/dashboard/manage'>Manage</Link>
            <br />
            <Outlet />
        </>
    )
}