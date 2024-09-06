import { useEffect } from "react";
import { useState } from "react";
import { claudeApiCall } from "./utils";
import ContentBox from "./components/ContentBox";
import Context from "./components/Context";
import AuthWidget from "./components/AuthWidget";
import UserProvider from "./contexts/UserContext";

export default function App() {
    return (
        <UserProvider>
            <Context/>
            <AuthWidget />
        </UserProvider>
    )
}