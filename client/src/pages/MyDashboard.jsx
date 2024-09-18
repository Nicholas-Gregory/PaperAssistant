import { useParams, useOutletContext } from 'react-router-dom'
import TopNav from '../components/TopNav';
import { useEffect, useRef, useState } from 'react';
import { apiCall } from '../utils';
import { useAuth } from '../contexts/UserContext';
import DashboardEditor from '../components/DashboardEditor';
import useData from '../hooks/useData';
import ServerError from '../components/ServerError';

export default function MyDashboard() {
    let { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState({});
    const [newDashboardName, setNewDashboardName] = useState('');
    const setActiveDashboard = useOutletContext();
    const { error, loading, data } = useData(`/dashboard/${dashboardId || 'new'}`);
    const saveModalRef = useRef();
    const editorRef = useRef();
    const { authorize, user } = useAuth();

    useEffect(() => {
        if (!error && !loading && data) {
            setActiveDashboard(data);
            setDashboard(data);
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
            contexts: (
                editorRef.current.getCards()
                .filter(card => !card.parent)
                .map(card => ({
                    role: card.role,
                    content: card.content,
                    children: card.children.map(card => ({
                        role: card.role,
                        content: card.content,
                        children: card.children
                    }))
                }))
            )
        }, authorize());

        setDashboard(response);
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
                    <button disabled={!newDashboardName.length > 0}>Submit</button>
                </form>
            </dialog>
            <TopNav>
                <>
                    {dashboard.name ? (
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