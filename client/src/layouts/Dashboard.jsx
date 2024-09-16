import { useOutletContext, Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import TopNavLink from '../components/TopNavLink'
import { useState } from 'react';

export default function Dashboard() {
    const { activeDashboard, setActiveDashboard } = useOutletContext();
    
    return (
        <>
            <TopNav>
                Dashboard
                <br /><br />
                <TopNavLink to={'/app/dashboard/manage'}>Manage</TopNavLink>&nbsp; | &nbsp;
                <TopNavLink to={'/app/dashboard/new'}>New</TopNavLink>
                {activeDashboard && (
                    <>
                        &nbsp; | &nbsp;<TopNavLink to={`/app/dashboard/${activeDashboard}`}>Dashboard</TopNavLink>
                    </>
                )}
            </TopNav>
            <Outlet context={ setActiveDashboard } />
        </>
    )
}