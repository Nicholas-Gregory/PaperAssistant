import { useParams, useOutletContext } from 'react-router-dom'
import TopNav from '../components/TopNav';
import { useEffect, useState } from 'react';
import { apiCall } from '../utils';
import { useAuth } from '../contexts/UserContext';
import Dashboard from '../components/Dashboard';

export default function MyDashboard() {
    let { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({});
    const { authorize } = useAuth();
    const setActiveDashboard = useOutletContext();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dashboardId) return;

        const response = apiCall('GET', `/dashboard/${dashboardId}`, null, authorize());

        if (response.error) {
            setError(response.type);
            return;
        }

        setDashboard(response);
        setActiveDashboard(dashboardId);
    }, [dashboardId]);

    return (
        <>
            <TopNav>
                Dashboard: {dashboard.name}
            </TopNav>

            <Dashboard dashboard={dashboard} />
        </>
    )
}