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

    if (response.ok) {
        return await response.json();
    }

    return { 
        role: 'assistant', 
        content: [
            { 
                type: 'text', 
                text: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Ante adipiscing ultricies tristique; commodo varius dignissim interdum. Ac lobortis ridiculus tincidunt tristique consectetur maecenas eleifend. Ut condimentum nunc arcu in vehicula libero tortor dapibus vivamus. Enim condimentum facilisis fusce ut sit non quis senectus! Quisque faucibus nisl urna est porta nostra tellus dolor eu. Placerat porttitor sollicitudin integer, justo sollicitudin sociosqu scelerisque. Ac quis enim imperdiet leo, lacinia felis. Id tellus dapibus efficitur commodo faucibus tristique molestie nulla.' 
            }
        ] 
    };
}