import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav';
import { useEffect, useRef, useState } from 'react';
import { apiCall } from '../utils';
import { useAuth } from '../contexts/UserContext';
import DashboardEditor from '../components/DashboardEditor';
import useData from '../hooks/useData';
import ServerError from '../components/ServerError';

export default function MyDashboard() {
    let { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState();
    const [newDashboardName, setNewDashboardName] = useState('');
    const { activeDashboards, setActiveDashboards } = useOutletContext();
    const { error, loading, data } = useData(`/dashboard/${dashboardId || 'new'}`);
    const saveModalRef = useRef();
    const editorRef = useRef();
    const { authorize, user, setUser } = useAuth();
    const navigate = useNavigate();

    const setDashboardsList = dashboard => !activeDashboards.some(d => d._id === dashboard._id) && (
        setActiveDashboards([...activeDashboards, dashboard])
    );

    useEffect(() => {
        if (!error && !loading && data) {
            setDashboard(data);
            setDashboardsList(data);
        }
        if (!dashboardId) {
            setDashboard(null);
        }
    }, [dashboardId, data]);

    async function handleSaveButtonClick() {
        if (dashboardId) {
            //Existing dashboard, PUT to /dashboard/:dashboardId

        } else {
            //New dashboard, POST to /dashboard
            saveModalRef.current.showModal()
        }
    }

    async function handleNameNewDashboardSubmit() {
        const response = await apiCall('POST', '/dashboard', {
            name: newDashboardName,
            ownerId: user._id,
            cards: editorRef.current.getCards()[0]
        }, authorize());

        setUser({
            ...user,
            dashboards: [...user.dashboards, response._id]
        });
        setDashboardsList(response);
        navigate(`/app/dashboard/${response._id}`);
    }

    return (
        <>
            <dialog ref={saveModalRef}>
                <form 
                    id='name-new-dashboard-form'
                    method='dialog'
                    onSubmit={handleNameNewDashboardSubmit}
                >
                    <label htmlFor='name-new-dashboard-form'>
                        Name the new dashboard: (esc to cancel)
                    </label>
                    <br />
                    <input
                        type='text'
                        placeholder='New Dashboard Name'
                        value={newDashboardName}
                        onChange={e => setNewDashboardName(e.target.value)}
                    />
                    &nbsp;<button disabled={!newDashboardName.length > 0}>Submit</button>
                </form>
            </dialog>
            <TopNav>
                <>
                    {dashboard ? (
                        <>
                            Dashboard: {dashboard.name}
                        </>
                    ) : (
                        'New Dashboard'
                    )}
                    &nbsp; | &nbsp;
                    <button onClick={handleSaveButtonClick}>
                        Save
                    </button>
                </>
            </TopNav>

            <DashboardEditor ref={editorRef} dashboard={dashboard} />

            <ServerError error={error} />
        </>
    )
}