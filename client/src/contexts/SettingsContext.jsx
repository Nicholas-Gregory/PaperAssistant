import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";

const SettingsContext = React.createContext();

export function useSettings() {
    return useContext(SettingsContext);
}

export default function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2048
    });
    const { user } = useAuth();

    useEffect(() => {
        if (user._id) {
            setSettings({ ...settings, ...user.settings });
        }
    }, [user]);

    return (
        <SettingsContext.Provider value={[settings, setSettings]}>
            {children}
        </SettingsContext.Provider>
    )
}