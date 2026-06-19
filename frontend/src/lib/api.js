import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5202/api';
// Base server URL (tanpa /api) untuk akses file uploads/images
export const SERVER_URL = API_URL.replace(/\/api$/, '');

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
