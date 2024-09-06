import React, { useContext, useEffect, useState } from "react";
import { apiCall } from "../utils";

const LOCAL_STORAGE_KEY = 'stream-notes.auth-token';

export const UserContext = React.createContext();

export function useAuth() {
    return useContext(UserContext);
}

export default function UserProvider({ children }) {
    const [user, setUser] = useState({ contexts: [] });

    useEffect(() => {
        (async () => {
            const token = authorize();

            if (token) {
                setUser(await apiCall('GET', '/user', null, token));
            }
        })();
    }, []);

    async function login(loginData) {
        const response = await apiCall('POST', '/user/login', loginData);

        localStorage.setItem(LOCAL_STORAGE_KEY, response.token);

        setUser(response.user || { context: [] });

        return response;
    }

    async function logout() {
        setUser({ notes: [], pins: [] });

        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    function authorize() {
        return localStorage.getItem(LOCAL_STORAGE_KEY);
    }

    return (
        <UserContext.Provider
            value={{
                user, setUser,
                login, logout,
                authorize
            }}
        >
            {children}
        </UserContext.Provider>
    )
}