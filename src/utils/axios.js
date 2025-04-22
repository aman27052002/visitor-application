import axios from 'axios';

const api = axios.create({
  baseURL: 'https://visitor-application-backend.onrender.com/api', // will be proxied to backend via Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
