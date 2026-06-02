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
  return config;
});

// ─── Response interceptor — handle expired token globally ─────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const isLoggedIn = () => !!getToken();

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export const registerParent = (data) =>
  API.post('/auth/register/parent', data);

export const registerNursery = (data) =>
  API.post('/auth/register/daycare', data);

// role: 'parent' | 'daycare'
export const verifyOtp = (email, code, role) =>
  API.post('/auth/verify-otp', { email, code, role });

export const forgotPassword = (email, role) =>
  API.post('/auth/forgot-password', { email, role });

export const resetPassword = (email, role, code, newPassword) =>
  API.post('/auth/reset-password', { email, role, code, newPassword });

export const loginParent = async (data) => {
  const res = await API.post('/auth/login', { ...data, role: 'parent' });
   console.log("LOGIN USER:", res.data.user);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res;
};

export const loginDaycare = async (data) => {
  const res = await API.post('/auth/login', { ...data, role: 'daycare' });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ─── DAYCARES (Parent search) ──────────────────────────────────────────────────
/**
 * GET /parents/search-daycares
 * Query params: name, city, price_min, price_max,
 *               has_lunch, has_snacks, has_transport,
 *               has_activities, age_range
 * All optional — omit to fetch all.
 */
export const searchDaycares = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  return API.get('/parents/search-daycares', { params: clean });
};

/** GET /daycares/:id — full detail page */
export const getDaycareById = (id) =>
  API.get(`/daycares/${id}`);

// ─── SAVED / FAVORITES ────────────────────────────────────────────────────────

/** GET /parents/:parentId/saved-daycares */
export const getSavedDaycares = (parentId) =>
  API.get(`/parents/${parentId}/saved-daycares`);

/** POST /parents/:parentId/save-daycare/:daycareId */
export const saveDaycare = (parentId, daycareId) =>
  API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

/** DELETE /parents/:parentId/saved-daycares/:daycareId */
export const unsaveDaycare = (parentId, daycareId) =>
  API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// ─── PROFILE ──────────────────────────────────────────────────────────────────
// ✅ Fixed: API doc says PUT /parents/profile (not /parents/update-profile)
export const updateProfile = (fields) =>
  API.put('/parents/profile', fields);

// ─── CHILDREN ─────────────────────────────────────────────────────────────────

/** GET /parents/:parentId/children */
export const getChildren = (parentId) =>
  API.get(`/parents/${parentId}/children`);

/**
 * POST /parents/:parentId/children
 * Body: { name, age, birth_date, gender, medical_issues? }
 */
export const addChild = (parentId, child) =>
  API.post(`/parents/${parentId}/children`, child);

/** PUT /parents/:parentId/children/:childId */
export const updateChild = (parentId, childId, fields) =>
  API.put(`/parents/${parentId}/children/${childId}`, fields);

// ─── ENROLLMENT REQUESTS ──────────────────────────────────────────────────────

/** POST /parents/:parentId/children/:childId/request-daycare/:daycareId */
export const requestEnrollment = (parentId, childId, daycareId) =>
  API.post(`/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`);

/** GET /parents/:parentId/requests */
export const getRequests = (parentId) =>
  API.get(`/parents/${parentId}/requests`);

/** DELETE /parents/:parentId/requests/:requestId */
export const cancelRequest = (parentId, requestId) =>
  API.delete(`/parents/${parentId}/requests/${requestId}`);

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

/**
 * POST /parents/:parentId/review-daycare/:daycareId
 * Body: { rating: 1-5, comment?: string }
 */
export const submitReview = (parentId, daycareId, rating, comment = '') =>
  API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
    rating,
    ...(comment ? { comment } : {}),
  });

// ─── SUPPORT MESSAGES ─────────────────────────────────────────────────────────

/** POST /parents/messages — Body: { subject, message } */
export const sendSupportMessage = (subject, message) =>
  API.post('/parents/messages', { subject, message });

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────

/** DELETE /parents/:parentId/delete */
export const deleteAccount = (parentId) =>
  API.delete(`/parents/${parentId}/delete`);

export default API;