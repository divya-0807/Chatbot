import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3888/auth',
  withCredentials: true,
});

export const login = (data) => API.post('/login', data);
export const signup = (data) => API.post('/signup', data);
export const forgotPassword = (data) => API.post('/forgot-password', data);
export const resetPassword = (data) => API.post('/reset-password', data);

export const logoutUser = () =>
  axios.post('http://localhost:3888/auth/logout', {}, { withCredentials: true });


export const checkAuth = () => API.get('/check-auth', { withCredentials: true });
