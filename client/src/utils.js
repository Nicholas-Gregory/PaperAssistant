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