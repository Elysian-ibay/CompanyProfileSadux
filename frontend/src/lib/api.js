import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5202/api';
// Base server URL (tanpa /api) untuk akses file uploads/images
export const SERVER_URL = API_URL.replace(/\/api$/, '');

// Resolve an image path to a full URL.
// - Absolute URLs (Supabase Storage / any http[s]) are returned as-is.
// - Legacy relative paths (e.g. "/uploads/foo.jpg") are prefixed with SERVER_URL.
export const imageUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${SERVER_URL}${path}`;
};

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
