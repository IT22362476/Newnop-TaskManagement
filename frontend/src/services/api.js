/**
 * API service module
 * Centralizes all HTTP calls to the backend.
 */
import axios from 'axios';

/**
 * Determine the API base URL:
 * 1. Development: Vite proxy at '/api'
 * 2. Production: from VITE_API_URL env var + '/api' suffix
 * 3. Fallback: detect Static Web Apps domain, use backend directly + '/api'
 */
let API_BASE;

if (import.meta.env.DEV) {
  // Local dev — use Vite proxy to backend
  API_BASE = '/api';
} else if (import.meta.env.VITE_API_URL) {
  // Production with env var set — use the configured backend URL + /api prefix
  API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api';
} else if (window.location.hostname.includes('azurestaticapps')) {
  // Deployed on Azure Static Web Apps but no VITE_API_URL set
  // Use the backend URL directly + /api prefix (update this if backend URL changes)
  API_BASE = 'https://newtaskmgmt-api-r6ykgn.azurewebsites.net/api';
} else {
  // Fallback
  API_BASE = '/api';
}

const API = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- Auth --------------------

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// -------------------- Tasks --------------------

export const getTasks = () => API.get('/tasks');
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// -------------------- Users (admin) --------------------

export const getUsers = () => API.get('/auth/users');
