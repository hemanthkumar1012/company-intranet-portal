import axios from 'axios';
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { if (typeof window !== 'undefined') { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; } return config; });
export const saveSession = (data) => { localStorage.setItem('token', data.token); localStorage.setItem('companyId', data.companyId); localStorage.setItem('role', data.role); localStorage.setItem('user', JSON.stringify(data.user || {})); };
export const logout = () => { ['token','companyId','role','user'].forEach((k) => localStorage.removeItem(k)); window.location.href = '/login'; };
