import TopNav from "../components/TopNav";
import TopNavLink from "../components/TopNavLink";

export default function Settings() {
    return (
        <>
            <TopNav>
                App Settings
                <br /><br />
                <TopNavLink to={'/app/settings/general'}>General</TopNavLink> &nbsp; | &nbsp;
                <TopNavLink to={'/app/settings/model'}>Model</TopNavLink> &nbsp; | &nbsp;
                <TopNavLink to={'/app/settings/connections'}>Connections</TopNavLink>
            </TopNav>
        </>
    )
}