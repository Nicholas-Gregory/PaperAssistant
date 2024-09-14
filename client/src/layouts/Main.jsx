import { Link, Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'

export default function Main() {
    return (
        <>
            <TopNav>
                PaperAssistant
                <br /><br />
                <TopNavLink to={'/home'}>Home</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/app'}>App</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/user'}>User</TopNavLink>&nbsp; | &nbsp;
            </TopNav>
            <Outlet />
        </>
    )
}