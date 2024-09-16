import { useParams, useOutletContext } from 'react-router-dom'
import TopNav from '../components/TopNav';
import { useEffect, useState } from 'react';
import { apiCall } from '../utils';
import { useAuth } from '../contexts/UserContext';
import DashboardEditor from '../components/DashboardEditor';
import useData from '../hooks/useData';
import ServerError from '../components/ServerError';

export default function MyDashboard() {
    let { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({});
    const setActiveDashboard = useOutletContext();
    const { error, loading, data } = useData(`/dashboard/${dashboardId || 'new'}`);

    useEffect(() => {
        if (!error && !loading && data) {
            setActiveDashboard(data);
            setDashboard(data);
        }
    }, [dashboardId, data]);

    return (
        <>
            <TopNav>
                {dashboard.name ? (
                    <>
                        Dashboard: {dashboard.name}
                    </>
                ) : (
                    'New Dashboard'
                )}
            </TopNav>

            <DashboardEditor dashboard={dashboard} />

            <ServerError error={error} />
        </>
    )
}