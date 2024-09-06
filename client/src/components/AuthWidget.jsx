import { useState } from "react";
import { useAuth } from "../contexts/UserContext";
import { apiCall } from "../utils";

export default function AuthWidget({}) {
    const { user, login, logout } = useAuth();
    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState(null);

    function clearFields() {
        setUsernameInput('');
        setEmailInput('');
        setPasswordInput('');
        setError(null);
    }

    async function handleCreateAccountClick() {
        const userData = {
            username: usernameInput,
            email: emailInput,
            password: passwordInput
        };

        const response = await apiCall('POST', '/user', userData);

        if (response.error) {
            setError(response.type);
            return;
        }

        await login(userData);
        clearFields();
    }

    async function handleLogin(e) {
        e.preventDefault();

        const response = await login({
            username: usernameInput,
            email: emailInput,
            password: passwordInput
        });

        if (response.error) {
            setError(response.type);
            return;
        }

        clearFields();
    }

    function handleLogoutClick() {
        logout();
        clearFields();
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                {user._id ? (
                    <>
                        <span>Logged in as:&nbsp;</span>
                        <span>{user.username}</span>
                        &nbsp;
                        <button onClick={handleLogoutClick}>Logout</button>
                    </>
                ) : (
                    <>
                        <form 
                            id="login-form"
                            onSubmit={handleLogin}
                        >
                            <input
                                type="text"
                                placeholder="Username"
                                value={usernameInput}
                                onChange={e => setUsernameInput(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                            />
                            <button type="submit">Login</button>
                            <button onClick={handleCreateAccountClick}>Create Account</button>
                        </form>
                    </>
                )}
            </div>
            {error && (
                <p>
                    {error}
                </p>
            )}
        </>
    )
}