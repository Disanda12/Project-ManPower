import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log the error for your debugging
        console.error("API Error intercepted:", error.response?.status, error.response?.data);

        // If the backend returns 400, 401, or 403
        if (error.response && [400, 401, 403].includes(error.response.status)) {
            
            // We assume 400 is an auth error because you are testing 1-min expiry
            console.warn("Session issue detected. Redirecting to login...");

            // 1. Clear the local data
            localStorage.clear();

            // 2. Immediate redirect
            window.location.href = '/login';

            // 3. Return a pending promise to "silence" the error in the component
            return new Promise(() => {});
        }

        return Promise.reject(error);
    }
);

export default API;