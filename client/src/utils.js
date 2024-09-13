export async function apiCall(method, endpoint, body, token) {
    return await (await fetch(`/api${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token && `Bearer ${token}`
        },
        body: body && JSON.stringify(body)
    })).json();
}

export async function claudeApiCall(bodyObject) {
    const body = JSON.stringify(bodyObject);
    const response = await fetch('/claude', {
        method: 'POST',
        headers: {
            'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
            'content-type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body
    });

    return await response.json();
}