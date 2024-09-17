import { Link } from 'react-router-dom'

export default function Manage() {
    return (
        <>
            Manage Dashboards Page
            <br />
            <Link to='/app/dashboard/123'>A Dashboard</Link>
            <br />
        </>
    )
}