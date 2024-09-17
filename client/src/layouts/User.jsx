import { useEffect } from "react";
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from "../contexts/UserContext"
import TopNav from "../components/TopNav";
import TopNavLink from "../components/TopNavLink";

export default function User() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user._id) {
            navigate(`/user/${user._id}`, { replace: true });
        } else {
            navigate('/user/auth', { replace: true });
        }
    }, [user]);

    return (
        <>
            <TopNav>
                User
                <br /><br />
                
                {user._id ? (
                    <>
                        <TopNavLink to={`/user/${user._id}`}>{user.username}'s Profile</TopNavLink>&nbsp; | &nbsp;
                        <TopNavLink to='/user/settings'>User Settings</TopNavLink>
                    </>
                ) : (
                    <TopNavLink to={'/user/auth'}>Login/Create Account</TopNavLink>
                )}
            </TopNav>
            <Outlet />
        </>
    )
}