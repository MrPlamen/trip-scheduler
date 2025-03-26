const request = async (method, url, data, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, { ...options, headers });
    const responseContentType = response.headers.get('Content-Type');

    if (!responseContentType) return;

    return await response.json();
};

export default {
    get: (url, data, options) => request('GET', url, data, options),
    post: (url, data, options) => request('POST', url, data, options),
    put: (url, data, options) => request('PUT', url, data, options),
    delete: (url, data, options) => request('DELETE', url, data, options),
    baseRequest: request,
};
