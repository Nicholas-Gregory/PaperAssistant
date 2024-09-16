import { Link, Outlet, useOutletContext } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'
import { useAuth } from '../contexts/UserContext'

export default function AppLayout() {
    const { user } = useAuth();
    const { activeDashboard, setActiveDashboard } = useOutletContext();

    return (
        <>
            <TopNav>
                App
                <br /><br />
                {user._id ? (
                    <>
                        <TopNavLink to={'/app/dashboard'}>Dashboard</TopNavLink>&nbsp; | &nbsp;
                        <TopNavLink to='/app/settings'>Settings</TopNavLink>&nbsp; | &nbsp;
                    </>
                ) : (
                    <>
                        <Link to={'/user/auth'}>Login or create an account</Link> to view the app!
                    </>
                )}
            </TopNav>
            {user._id && (
                <Outlet context={{ activeDashboard, setActiveDashboard }}/>
            )}
        </>
    )
}