import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 90000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const isGuestMode = localStorage.getItem('stemlearn:guestMode') === 'true';
      if (isGuestMode && !localStorage.getItem('token')) {
        return Promise.reject(err);
      }
      localStorage.removeItem('token');
      sessionStorage.setItem('authMessage', err.response?.data?.message || 'Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
