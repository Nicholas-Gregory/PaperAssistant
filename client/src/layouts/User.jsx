import { useEffect } from "react";
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from "../contexts/UserContext"

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
        <Outlet />
    )
}