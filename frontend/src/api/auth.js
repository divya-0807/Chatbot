import axios from 'axios';

const base = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ''); // remove trailing slash

const API = axios.create({
  baseURL: base + '/auth',
  withCredentials: true,
});

export const login = (data) => API.post('/login', data);
export const signup = (data) => API.post('/signup', data);
export const forgotPassword = (data) => API.post('/forgot-password', data);
export const resetPassword = (data) => API.post('/reset-password', data);

export const logoutUser = () =>
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });


export const checkAuth = () => API.get('/check-auth', { withCredentials: true });
