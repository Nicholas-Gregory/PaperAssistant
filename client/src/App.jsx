import UserProvider from "./contexts/UserContext";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import Main from "./layouts/Main";
import Home from "./pages/Home";
import Manage from "./pages/Manage";
import MyDashboard from "./pages/MyDashboard";
import Dashboard from "./layouts/Dashboard";
import AppLayout from "./layouts/AppLayout";
import User from "./layouts/User";
import Settings from "./layouts/Settings";
import Connections from "./pages/Connections";
import General from "./pages/General";
import UserPage from "./pages/UserPage";
import Auth from "./pages/Auth";


export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Main />}
                    >
                        <Route
                            index
                            element={<Navigate to='/home' replace/>}
                        />

                        <Route
                            path="/home"
                            element={<Home />}
                        />

                        <Route
                            path='/app'
                            element={<AppLayout />}
                        >
                            <Route
                                index
                                element={<Navigate to='/app/dashboard/manage' replace/>}
                            />
                            <Route
                                path="/app/dashboard"
                                element={<Dashboard />}
                            >
                                <Route
                                    index
                                    element={<Navigate to={'/app/dashboard/manage'} replace />}
                                />

                                <Route
                                    path="/app/dashboard/manage"
                                    element={<Manage />}
                                />

                                <Route
                                    path="/app/dashboard/:dashboardId"
                                    element={<MyDashboard />}
                                />
                            </Route>

                            <Route
                                path="/app/settings"
                                element={<Settings />}
                            >
                                <Route
                                    index
                                    element={<Navigate to={'/app/settings/general'} replace />}
                                />

                                <Route
                                    path="/app/settings/connections"
                                    element={<Connections />}
                                />

                                <Route
                                    path="/app/settings/general"
                                    element={<General />}
                                />
                            </Route>
                        </Route>
                        <Route
                            path="/user"
                            element={<User />}
                        >
                            <Route
                                path="/user/:id"
                                element={<UserPage />}
                            />

                            <Route
                                path="/user/auth"
                                element={<Auth />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}