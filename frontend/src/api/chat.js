// src/api/chat.js
import axios from 'axios';

const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, ''); // Remove trailing slash if any

const ChatAPI = axios.create({
  baseURL: `${base}/chat`,
  withCredentials: true,
});

export const getAllChats = () => ChatAPI.get('/all');
export const createChat = () => ChatAPI.post('/new');
export const getChat = (id) => ChatAPI.get(`/${id}`);

// Supports sending FormData with question and optional image
export const sendMessage = (id, formData) => {
  // Validate formData
  if (!(formData instanceof FormData)) {
    console.error("sendMessage expects a FormData instance");
    return Promise.reject(new Error("Invalid data format"));
  }
  return ChatAPI.post(`/${id}`, formData);
};

export const deleteChat = (id) => ChatAPI.delete(`/${id}`);
