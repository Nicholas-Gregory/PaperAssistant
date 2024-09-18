import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/UserContext'
import { useEffect, useState } from 'react';
import { apiCall } from '../utils';

export default function Manage() {
    const { user, authorize } = useAuth();
    const [dashboards, setDashboards] = useState([]);

    useEffect(() => {
        user.dashboards.forEach(dashboardId => (
            apiCall('GET', `/dashboard/${dashboardId}`, null, authorize())
            .then(response => (
                !dashboards.some(dashboard => (
                    dashboard._id === response._id
                )) && setDashboards(dashboards => [...dashboards, {
                    name: response.name,
                    _id: response._id
                }])
            ))
        ));
    }, [user]);

    return (
        <center>
            Manage Dashboards
            <br />
            {dashboards.map(dashboard => (
                <>
                    <Link to={`/app/dashboard/${dashboard._id}`}>
                        <div 
                            className='clickable card'
                            style={{
                                margin: '5px',
                                width: 'fit-content'
                            }}
                        >
                            {dashboard.name}
                        </div>
                    </Link>
                </>
            ))}
        </center>
    )
}