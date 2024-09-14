import { useParams } from 'react-router-dom'

export default function MyDashboard() {
    let { dashboardId } = useParams();
    return (
        <>
            Dashboard {dashboardId}'s Page
        </>
    )
}