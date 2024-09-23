import { useOutletContext, Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'
import { Fragment } from 'react';

export default function Dashboard() {
    const { activeDashboards, setActiveDashboards } = useOutletContext();
    
    return (
        <>
            <TopNav>
                Dashboard
                <br /><br />
                <TopNavLink to={'/app/dashboard/manage'}>Manage</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/app/dashboard/new'}>New</TopNavLink>
                {activeDashboards.map((dashboard, index) => (
                    <Fragment key={index}>
                        <>
                            &nbsp; | &nbsp;
                        </>
                        <TopNavLink to={`/app/dashboard/${dashboard._id}`}>{dashboard.name}</TopNavLink>
                    </Fragment>
                ))}
            </TopNav>
            <Outlet context={{ activeDashboards, setActiveDashboards }} />
        </>
    )
}