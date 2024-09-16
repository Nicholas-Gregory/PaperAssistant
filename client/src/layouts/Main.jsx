import { useNavigate, Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'
import { useAuth } from '../contexts/UserContext'

export default function Main() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogoutClick() {
        navigate('/user/auth', { replace: true });
        logout();
    }
    
    return (
        <>
            <TopNav>
                PaperAssistant
                <br /><br />
                <TopNavLink to={'/home'}>Home</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/app'}>App</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/user'}>User</TopNavLink>&nbsp; | &nbsp;
                {user._id && (
                    <span style={{ float: 'right' }}>
                        Logged in as {user.username}&nbsp;| &nbsp;
                        <button onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </span>
                )}
            </TopNav>
            <Outlet />
        </>
    )
}