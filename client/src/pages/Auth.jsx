import { useEffect, useState } from "react";
import { apiCall } from "../utils";
import { useAuth } from "../contexts/UserContext";

const formInputStyle = {
    margin: '5px'
};

const emailPattern = /^[\w-.!#$&'*+=?^`{}|~/]+@([\w-]+\.)+[\w-]{2,}$/;

const emailProblem = 'Must input a valid email address';

const passwordLengthProblem = 'Passwords must be at least 8 characters';

const passwordsMatchingProblem = 'Passwords do not match';

export default function Auth() {
    const [usernameOrEmailLoginInput, setUsernameOrEmailLoginInput] = useState('');
    const [passwordLoginInput, setPasswordLoginInput] = useState('');
    const [createUsernameInput, setCreateUsernameInput] = useState('');
    const [createEmailInput, setCreateEmailInput] = useState('');
    const [createPasswordInput, setCreatePasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [error, setError] = useState(null);
    const [problems, setProblems] = useState([]);
    const [createAccountButtonDisabled, setCreateAccountButtonDisabled] = useState(true);
    const { login, setUser } = useAuth();

    useEffect(() => {
        setCreateAccountButtonDisabled(
            !(createUsernameInput.length > 0 &&
            createEmailInput.length > 0 &&
            createPasswordInput.length > 0 &&
            confirmPasswordInput.length > 0 &&
            problems.length === 0)
        );
    }, [createUsernameInput, createEmailInput, createPasswordInput, confirmPasswordInput, problems]);

    async function handleLoginSubmit(e) {
        e.preventDefault();

        const response = await login({
            username: usernameOrEmailLoginInput,
            email: usernameOrEmailLoginInput,
            password: passwordLoginInput
        });

        if (response.error) {
            setError(response.type);
            return;
        }
    }

    async function handleCreateAccountSubmit(e) {
        e.preventDefault();

        const response = await apiCall('POST', '/user', {
            username: createUsernameInput,
            password: createPasswordInput,
            email: createEmailInput
        });

        if (response.error) {
            setError(response.type);
            return;
        }

        setUser(response);
    }

    async function handleCreateEmailInputChange(e) {
        const value = e.target.value;
        setCreateEmailInput(value);

        if (!emailPattern.test(value) && value !== '') {
            if (!problems.includes(emailProblem)) {
                setProblems([...problems, emailProblem]);
            }
        } else {
            setProblems(problems.filter(problem => problem !== emailProblem))
        }
    }

    function handlePasswordsMatchingProblem(first, confirm) {
        if (first !== confirm) {
            if (!problems.includes(passwordsMatchingProblem)) {
                setProblems(problems => [...problems, passwordsMatchingProblem]);
            }
        } else {
            setProblems(problems => problems.filter(problem => problem !== passwordsMatchingProblem));
        }
    }

    function handleCreatePasswordInputChange(e) {
        const value = e.target.value;
        setCreatePasswordInput(value);

        if ((value.length < 8) && value.length > 0) {
            if (!problems.includes(passwordLengthProblem)) {
                setProblems(problems => [...problems, passwordLengthProblem]);
            }
        } else {
            setProblems(problems => problems.filter(problem => problem !== passwordLengthProblem));
        }

        handlePasswordsMatchingProblem(value, confirmPasswordInput);
    }

    function handleConfirmPasswordInputChange(e) {
        const value = e.target.value;
        setConfirmPasswordInput(value);

        handlePasswordsMatchingProblem(createPasswordInput, value);
    }

    return (
        <>
            <form 
                style={formInputStyle}
                id="login-form"
                onSubmit={handleLoginSubmit}
            >
                <label htmlFor="login-form">
                    Login to your account:
                </label>
                <br />
                <input
                    style={formInputStyle}
                    type="text"
                    placeholder="Username or Email"
                    value={usernameOrEmailLoginInput}
                    onChange={e => setUsernameOrEmailLoginInput(e.target.value)}
                />
                <br />
                <input
                    style={formInputStyle}
                    type="password"
                    placeholder="Password"
                    value={passwordLoginInput}
                    onChange={e => setPasswordLoginInput(e.target.value)}
                />
                <br />
                <button>Login</button>
            </form>
            <br />
            <form
                style={formInputStyle}
                id="create-account-form"
                onSubmit={handleCreateAccountSubmit}
            >
                <label htmlFor="create-account-form">
                    Create a new account:
                </label>
                <br />
                <input
                    style={formInputStyle}
                    type="text"
                    placeholder="Username"
                    value={createUsernameInput}
                    onChange={e => setCreateUsernameInput(e.target.value)}
                />
                <br />
                <input
                    style={formInputStyle}
                    type="text"
                    placeholder="Email"
                    value={createEmailInput}
                    onChange={handleCreateEmailInputChange}
                />
                <br />
                <input
                    style={formInputStyle}
                    type="password"
                    placeholder="Password"
                    value={createPasswordInput}
                    onChange={handleCreatePasswordInputChange}
                />
                <br />
                <input
                    style={formInputStyle}
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPasswordInput}
                    onChange={handleConfirmPasswordInputChange}
                />
                <br />
                <button disabled={createAccountButtonDisabled}>Create Account</button>
            </form>
            {error && (
                <p>
                    {error}
                </p>
            )}
            {problems.map((problem, index) => (
                <p key={index}>
                    {problem}
                </p>
            ))}
        </>
    )
}