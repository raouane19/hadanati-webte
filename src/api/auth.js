import axios from 'axios';

// ─── Axios instance ────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

// ─── Request interceptor — attach token automatically ─────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If body is FormData let the browser set Content-Type (with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// ─── Response interceptor — handle expired token globally ─────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!getToken();

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('pendingUser');
};

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export const registerParent = (data) =>
  API.post('/auth/register/parent', data);

export const registerNursery = (data) =>
  API.post('/auth/register/daycare', data);

export const verifyOtp = (email, code, role) =>
  API.post('/auth/verify-otp', { email, code, role });

export const forgotPassword = (email, role) =>
  API.post('/auth/forgot-password', { email, role });

export const resetPassword = (email, role, code, newPassword) =>
  API.post('/auth/reset-password', { email, role, code, newPassword });

export const loginParent = async (data) => {
  const res = await API.post('/auth/login', { ...data, role: 'parent' });
  console.log('LOGIN RESPONSE:', res.data);
  clearSession();
  localStorage.setItem('token',    res.data.token);
  localStorage.setItem('userRole', 'parent');
  localStorage.setItem('user',     JSON.stringify(res.data.user));
  return res;
};

export const loginDaycare = async (data) => {
  const res = await API.post('/auth/login', { ...data, role: 'daycare' });
  clearSession();
  localStorage.setItem('token',    res.data.token);
  localStorage.setItem('userRole', 'daycare');
  localStorage.setItem('user',     JSON.stringify(res.data.user));
  return res;
};

export const logout = () => {
  clearSession();

};

// ─── PROFILE ──────────────────────────────────────────────────────────────────

export const getProfile = (parentId) =>
  API.get(`/parents/${parentId}/profile`);

export const updateProfile = (fields) =>
  API.put('/parents/profile', fields);

// ─── DAYCARES ─────────────────────────────────────────────────────────────────

export const searchDaycares = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  return API.get('/parents/search-daycares', { params: clean });
};

export const getDaycareById = (id) =>
  API.get(`/daycares/${id}`);

// ─── SAVED / FAVORITES ────────────────────────────────────────────────────────

export const getSavedDaycares = (parentId) =>
  API.get(`/parents/${parentId}/saved-daycares`);

export const saveDaycare = (parentId, daycareId) =>
  API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

export const unsaveDaycare = (parentId, daycareId) =>
  API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// ─── CHILDREN ─────────────────────────────────────────────────────────────────

export const getChildren = (parentId) =>
  API.get(`/parents/${parentId}/children`);

export const addChild = (parentId, formData) =>
  API.post(`/parents/${parentId}/children`, formData);

export const updateChild = (parentId, childId, formData) =>
  API.put(`/parents/${parentId}/children/${childId}`, formData);

// ─── ENROLLMENT REQUESTS ──────────────────────────────────────────────────────

export const requestEnrollment = (parentId, childId, daycareId) =>
  API.post(`/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`);

export const getRequests = (parentId) =>
  API.get(`/parents/${parentId}/requests`);

export const cancelRequest = (parentId, requestId) =>
  API.delete(`/parents/${parentId}/requests/${requestId}`);

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const submitReview = (parentId, daycareId, rating, comment = '') =>
  API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
    rating,
    ...(comment ? { comment } : {}),
  });

// ─── SUPPORT MESSAGES ─────────────────────────────────────────────────────────

export const sendSupportMessage = (subject, message) =>
  API.post('/parents/messages', { subject, message });

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────

export const deleteAccount = (parentId) =>
  API.delete(`/parents/${parentId}/delete`);

export default API;