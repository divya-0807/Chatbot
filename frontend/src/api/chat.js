// src/api/chat.js
import axios from 'axios';

const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

const ChatAPI = axios.create({
  baseURL: `${base}/chat`,
  withCredentials: true,
});

export const getAllChats = () => ChatAPI.get('/all');
export const createChat = () => ChatAPI.post('/new');
export const getChat = (id) => ChatAPI.get(`/${id}`);

// ✅ Corrected: Send plain JSON (no FormData)
export const sendMessage = (id, question) => {
  const cleanText = typeof question === 'string' ? question.trim() : '';
  return ChatAPI.post(`/${id}`, { question: cleanText });
};

export const deleteChat = (id) => ChatAPI.delete(`/${id}`);
