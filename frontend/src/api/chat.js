// src/api/chat.js
import axios from 'axios';
const base = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ''); // remove trailing slash

const ChatAPI = axios.create({
  baseURL: base+'/chat',
  withCredentials: true,
});

export const getAllChats = () => ChatAPI.get('/all');
export const createChat = () => ChatAPI.post('/new');
export const getChat = (id) => ChatAPI.get(`/${id}`);
export const sendMessage = (id, message) => {
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  return ChatAPI.post(`/${id}`, { question: cleanMessage });
};

export const deleteChat = (id) => ChatAPI.delete(`/${id}`);
