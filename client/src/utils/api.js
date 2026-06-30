import axios from 'axios';

const LIVE_ORIGIN = 'https://osf-q6kb.onrender.com';

const getRuntimeOrigin = () => {
  if (typeof window === 'undefined') return LIVE_ORIGIN;
  return window.location.origin || LIVE_ORIGIN;
};

const normalizeApiBase = (url) => {
  const rawUrl = String(url || getRuntimeOrigin()).trim();
  const isRenderDeploy =
    typeof window !== 'undefined' && window.location.hostname.endsWith('onrender.com');
  const hasLocalApi =
    /localhost|127\.0\.0\.1/i.test(rawUrl);
  const cleanUrl = (isRenderDeploy && hasLocalApi ? getRuntimeOrigin() : rawUrl).replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_URL),
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
