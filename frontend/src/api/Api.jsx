import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

Api.interceptors.request.use(config => {
    const token = localStorage.getItem('access');

    // Exclude public routes from token injection
    const publicRoutes = ['/register/', '/auth/login/', '/auth/refresh'];

    if (!publicRoutes.some(route => config.url.endsWith(route))) {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export default Api;
