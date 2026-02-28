import axios from 'axios';

// In production set VITE_API_URL to your backend (e.g. https://your-app.onrender.com/api)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const ANONYMOUS_ID_KEY = 'vaakku_anonymous_id';

export function getAnonymousId() {
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `anon_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers['X-Anonymous-Id'] = getAnonymousId();
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/signup');
      const isAiRoute = url.includes('/ai/');
      if (!isAuthAttempt && !isAiRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const auth = {
  signup: (email, password) => api.post('/auth/signup', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const userApi = {
  updateSarvamApiKey: (sarvamApiKey) => api.patch('/user/sarvam-api-key', { sarvamApiKey }),
};

export const ai = {
  tts: (body) => api.post('/ai/tts', body),
  stt: (formData) => api.post('/ai/stt', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  translate: (body) => api.post('/ai/translate', body),
};

export const historyApi = {
  getList: (params) => api.get('/history', { params }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};
