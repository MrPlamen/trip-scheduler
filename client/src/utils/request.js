const request = async (method, url, data) => {
    const options = { method };

    if (data) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return await response.json();
};

export default {
    get: (url, data) => request('GET', url, data),
    post: (url, data) => request('POST', url, data),
    put: (url, data) => request('PUT', url, data),
    delete: (url, data) => request('DELETE', url, data),
};
