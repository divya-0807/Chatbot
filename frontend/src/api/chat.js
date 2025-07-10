// src/api/chat.js
import axios from 'axios';

const ChatAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL+'/chat',
  withCredentials: true,
});

export const getAllChats = () => ChatAPI.get('/all');
export const createChat = () => ChatAPI.post('/new');
export const getChat = (id) => ChatAPI.get(`/${id}`);
export const sendMessage = (id, message) => ChatAPI.post(`/${id}`, { question: message });
export const deleteChat = (id) => ChatAPI.delete(`/${id}`);
