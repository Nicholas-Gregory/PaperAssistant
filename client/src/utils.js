export async function apiCall(method, endpoint, body, token) {
    const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token && `Bearer ${token}`
        },
        body: body && JSON.stringify(body)
    });

    if (response.status !== 204) {
        return await response.json();
    }

    return response;
}

export function getBackgroundColor(type) {
    if (type === 'user') {
        return 'aqua'
    } else if (type === 'assistant') {
        return 'aquamarine'
    } else if (type === 'system') {
        return 'cadetblue'
    } else if (type === 'note') {
        return 'azure'
    }
}