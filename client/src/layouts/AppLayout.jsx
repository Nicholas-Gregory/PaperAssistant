import { Link, Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'

export default function AppLayout() {
    return (
        <>
            <TopNav>
                App
                <br /><br />
                <TopNavLink to={'/app/dashboard'}>Dashboard</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to='/app/settings'>Settings</TopNavLink>&nbsp; | &nbsp;
            </TopNav>
            <Outlet />
        </>
    )
}