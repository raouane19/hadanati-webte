// // import axios from 'axios';

// // // ─── Axios instance ────────────────────────────────────────────────────────────
// // const API = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
// //   headers: {
// //     'ngrok-skip-browser-warning': 'true',
// //   },
// // });

// // // ─── Request interceptor — attach token automatically ─────────────────────────
// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('token');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // ─── Response interceptor — handle expired token globally ─────────────────────
// // // API.interceptors.response.use(
// // //   (response) => response,
// // //   (error) => {
// // //     if (error.response?.status === 401) {
// // //       localStorage.removeItem('token');
// // //       localStorage.removeItem('user');
// // //       window.location.href = '/login';
// // //     }
// // //     return Promise.reject(error);
// // //   }
// // // );
// // API.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401 && localStorage.getItem('token')) {
// //       localStorage.removeItem('token');
// //       localStorage.removeItem('user');
// //       window.location.href = '/login';
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // export const getToken = () => localStorage.getItem('token');
// // export const getUser = () => {
// //   try {
// //     const user = localStorage.getItem('user');
// //     return user ? JSON.parse(user) : null;
// //   } catch {
// //     return null;
// //   }
// // };

// // export const isLoggedIn = () => !!getToken();

// // // ─── AUTH ──────────────────────────────────────────────────────────────────────

// // export const registerParent = (data) =>
// //   API.post('/auth/register/parent', data);

// // export const registerNursery = (data) =>
// //   API.post('/auth/register/daycare', data);

// // // role: 'parent' | 'daycare'
// // export const verifyOtp = (email, code, role) =>
// //   API.post('/auth/verify-otp', { email, code, role });

// // export const forgotPassword = (email, role) =>
// //   API.post('/auth/forgot-password', { email, role });

// // export const resetPassword = (email, role, code, newPassword) =>
// //   API.post('/auth/reset-password', { email, role, code, newPassword });

// // export const loginParent = async (data) => {
// //   const res = await API.post('/auth/login', { ...data, role: 'parent' });
// //    console.log("LOGIN USER:", res.data.user);
// //   localStorage.setItem('token', res.data.token);
// //   localStorage.setItem('user', JSON.stringify(res.data.user));
// //   return res;
// // };

// // export const loginDaycare = async (data) => {
// //   const res = await API.post('/auth/login', { ...data, role: 'daycare' });
// //   localStorage.setItem('token', res.data.token);
// //   localStorage.setItem('user', JSON.stringify(res.data.user));
// //   return res;
// // };

// // export const logout = () => {
// //   localStorage.removeItem('token');
// //   localStorage.removeItem('user');
// //   window.location.href = '/login';
// // };

// // // ─── DAYCARES (Parent search) ──────────────────────────────────────────────────
// // /**
// //  * GET /parents/search-daycares
// //  * Query params: name, city, price_min, price_max,
// //  *               has_lunch, has_snacks, has_transport,
// //  *               has_activities, age_range
// //  * All optional — omit to fetch all.
// //  */
// // export const searchDaycares = (params = {}) => {
// //   const clean = Object.fromEntries(
// //     Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
// //   );
// //   return API.get('/parents/search-daycares', { params: clean });
// // };

// // /** GET /daycares/:id — full detail page */
// // export const getDaycareById = (id) =>
// //   API.get(`/daycares/${id}`);

// // // ─── SAVED / FAVORITES ────────────────────────────────────────────────────────

// // /** GET /parents/:parentId/saved-daycares */
// // export const getSavedDaycares = (parentId) =>
// //   API.get(`/parents/${parentId}/saved-daycares`);

// // /** POST /parents/:parentId/save-daycare/:daycareId */
// // export const saveDaycare = (parentId, daycareId) =>
// //   API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

// // /** DELETE /parents/:parentId/saved-daycares/:daycareId */
// // export const unsaveDaycare = (parentId, daycareId) =>
// //   API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// // // ─── PROFILE ──────────────────────────────────────────────────────────────────
// // // ✅ Fixed: API doc says PUT /parents/profile (not /parents/update-profile)
// // export const updateProfile = (fields) =>
// //   API.put('/parents/profile', fields);

// // // ─── CHILDREN ─────────────────────────────────────────────────────────────────

// // /** GET /parents/:parentId/children */
// // export const getChildren = (parentId) =>
// //   API.get(`/parents/${parentId}/children`);

// // /**
// //  * POST /parents/:parentId/children
// //  * Body: { name, age, birth_date, gender, medical_issues? }
// //  */
// // export const addChild = (parentId, child) =>
// //   API.post(`/parents/${parentId}/children`, child);

// // /** PUT /parents/:parentId/children/:childId */
// // export const updateChild = (parentId, childId, fields) =>
// //   API.put(`/parents/${parentId}/children/${childId}`, fields);

// // // ─── ENROLLMENT REQUESTS ──────────────────────────────────────────────────────

// // /** POST /parents/:parentId/children/:childId/request-daycare/:daycareId */
// // export const requestEnrollment = (parentId, childId, daycareId) =>
// //   API.post(`/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`);

// // /** GET /parents/:parentId/requests */
// // export const getRequests = (parentId) =>
// //   API.get(`/parents/${parentId}/requests`);

// // /** DELETE /parents/:parentId/requests/:requestId */
// // export const cancelRequest = (parentId, requestId) =>
// //   API.delete(`/parents/${parentId}/requests/${requestId}`);

// // // ─── REVIEWS ──────────────────────────────────────────────────────────────────

// // /**
// //  * POST /parents/:parentId/review-daycare/:daycareId
// //  * Body: { rating: 1-5, comment?: string }
// //  */
// // export const submitReview = (parentId, daycareId, rating, comment = '') =>
// //   API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
// //     rating,
// //     ...(comment ? { comment } : {}),
// //   });

// // // ─── SUPPORT MESSAGES ─────────────────────────────────────────────────────────

// // /** POST /parents/messages — Body: { subject, message } */
// // export const sendSupportMessage = (subject, message) =>
// //   API.post('/parents/messages', { subject, message });

// // // ─── ACCOUNT ──────────────────────────────────────────────────────────────────

// // /** DELETE /parents/:parentId/delete */
// // export const deleteAccount = (parentId) =>
// //   API.delete(`/parents/${parentId}/delete`);
// // export const getProfile = (parentId) =>
// //   API.get(`/parents/${parentId}/profile`);

// // export default API;
// // import axios from 'axios';

// // // ─── Axios instance ────────────────────────────────────────────────────────────
// // const API = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
// //   headers: {
// //     'ngrok-skip-browser-warning': 'true',
// //   },
// // });

// // // ─── Request interceptor — attach token automatically ─────────────────────────
// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem('token');
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   // If body is FormData let the browser set Content-Type (with boundary)
// //   if (config.data instanceof FormData) {
// //     delete config.headers['Content-Type'];
// //   }
// //   return config;
// // });

// // // ─── Response interceptor — handle expired token globally ─────────────────────
// // API.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401 && localStorage.getItem('token')) {
// //       localStorage.removeItem('token');
// //       localStorage.removeItem('user');
// //       window.location.href = '/login';
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // export const getToken = () => localStorage.getItem('token');

// // export const getUser = () => {
// //   try {
// //     const user = localStorage.getItem('user');
// //     return user ? JSON.parse(user) : null;
// //   } catch {
// //     return null;
// //   }
// // };

// // export const isLoggedIn = () => !!getToken();

// // // ─── AUTH ──────────────────────────────────────────────────────────────────────

// // export const registerParent = (data) =>
// //   API.post('/auth/register/parent', data);

// // export const registerNursery = (data) =>
// //   API.post('/auth/register/daycare', data);

// // export const verifyOtp = (email, code, role) =>
// //   API.post('/auth/verify-otp', { email, code, role });

// // export const forgotPassword = (email, role) =>
// //   API.post('/auth/forgot-password', { email, role });

// // export const resetPassword = (email, role, code, newPassword) =>
// //   API.post('/auth/reset-password', { email, role, code, newPassword });

// // export const loginParent = async (data) => {
// //   const res = await API.post('/auth/login', { ...data, role: 'parent' });
// //   console.log('LOGIN USER:', res.data.user);
// //   localStorage.setItem('token', res.data.token);
// //   localStorage.setItem('user', JSON.stringify(res.data.user));
// //   return res;
// // };

// // export const loginDaycare = async (data) => {
// //   const res = await API.post('/auth/login', { ...data, role: 'daycare' });
// //   localStorage.setItem('token', res.data.token);
// //   localStorage.setItem('user', JSON.stringify(res.data.user));
// //   return res;
// // };

// // export const logout = () => {
// //   localStorage.removeItem('token');
// //   localStorage.removeItem('user');
// //   window.location.href = '/login';
// // };

// // // ─── PROFILE ──────────────────────────────────────────────────────────────────

// // /**
// //  * GET /parents/:parentId/profile
// //  * Returns full parent data: first_name, last_name, phone, city, profile_image, etc.
// //  */
// // export const getProfile = (parentId) =>
// //   API.get(`/parents/${parentId}/profile`);

// // /**
// //  * PUT /parents/profile
// //  * Accepts FormData (so a profile_image file can be included) or a plain object.
// //  */
// // export const updateProfile = (fields) =>
// //   API.put('/parents/profile', fields);

// // // ─── DAYCARES (Parent search) ──────────────────────────────────────────────────
// // export const searchDaycares = (params = {}) => {
// //   const clean = Object.fromEntries(
// //     Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
// //   );
// //   return API.get('/parents/search-daycares', { params: clean });
// // };

// // export const getDaycareById = (id) =>
// //   API.get(`/daycares/${id}`);

// // // ─── SAVED / FAVORITES ────────────────────────────────────────────────────────

// // export const getSavedDaycares = (parentId) =>
// //   API.get(`/parents/${parentId}/saved-daycares`);

// // export const saveDaycare = (parentId, daycareId) =>
// //   API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

// // export const unsaveDaycare = (parentId, daycareId) =>
// //   API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// // // ─── CHILDREN ─────────────────────────────────────────────────────────────────

// // export const getChildren = (parentId) =>
// //   API.get(`/parents/${parentId}/children`);

// // export const addChild = (parentId, child) =>
// //   API.post(`/parents/${parentId}/children`, child);

// // export const updateChild = (parentId, childId, fields) =>
// //   API.put(`/parents/${parentId}/children/${childId}`, fields);

// // // ─── ENROLLMENT REQUESTS ──────────────────────────────────────────────────────

// // export const requestEnrollment = (parentId, childId, daycareId) =>
// //   API.post(`/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`);

// // export const getRequests = (parentId) =>
// //   API.get(`/parents/${parentId}/requests`);

// // export const cancelRequest = (parentId, requestId) =>
// //   API.delete(`/parents/${parentId}/requests/${requestId}`);

// // // ─── REVIEWS ──────────────────────────────────────────────────────────────────

// // export const submitReview = (parentId, daycareId, rating, comment = '') =>
// //   API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
// //     rating,
// //     ...(comment ? { comment } : {}),
// //   });

// // // ─── SUPPORT MESSAGES ─────────────────────────────────────────────────────────

// // export const sendSupportMessage = (subject, message) =>
// //   API.post('/parents/messages', { subject, message });

// // // ─── ACCOUNT ──────────────────────────────────────────────────────────────────

// // export const deleteAccount = (parentId) =>
// //   API.delete(`/parents/${parentId}/delete`);

// // export default API;
// import axios from 'axios';

// // ─── Axios instance ────────────────────────────────────────────────────────────
// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
//   headers: {
//     'ngrok-skip-browser-warning': 'true',
//   },
// });

// // ─── Request interceptor — attach token automatically ─────────────────────────
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   // If body is FormData let the browser set Content-Type (with boundary)
//   if (config.data instanceof FormData) {
//     delete config.headers['Content-Type'];
//   }
//   return config;
// });

// // ─── Response interceptor — handle expired token globally ─────────────────────
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && localStorage.getItem('token')) {
//       clearSession();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// export const getToken = () => localStorage.getItem('token');

// export const getUser = () => {
//   try {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   } catch {
//     return null;
//   }
// };

// export const isLoggedIn = () => !!getToken();

// // Wipes ALL session data — called on login, signup, and logout
// // so no old user ever bleeds into a new session
// const clearSession = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   localStorage.removeItem('userRole');
//   localStorage.removeItem('userId');
//   localStorage.removeItem('userName');
//   localStorage.removeItem('userEmail');
//   localStorage.removeItem('pendingUser');
// };

// // ─── AUTH ──────────────────────────────────────────────────────────────────────

// export const registerParent = (data) =>
//   API.post('/auth/register/parent', data);

// export const registerNursery = (data) =>
//   API.post('/auth/register/daycare', data);

// export const verifyOtp = (email, code, role) =>
//   API.post('/auth/verify-otp', { email, code, role });

// export const forgotPassword = (email, role) =>
//   API.post('/auth/forgot-password', { email, role });

// export const resetPassword = (email, role, code, newPassword) =>
//   API.post('/auth/reset-password', { email, role, code, newPassword });

// export const loginParent = async (data) => {
//   const res = await API.post('/auth/login', { ...data, role: 'parent' });
//   clearSession(); // wipe any previous user before saving new one
//   localStorage.setItem('token',    res.data.token);
//   localStorage.setItem('userRole', 'parent');
//   localStorage.setItem('user',     JSON.stringify(res.data.user));
//   return res;
// };

// export const loginDaycare = async (data) => {
//   const res = await API.post('/auth/login', { ...data, role: 'daycare' });
//   clearSession(); // wipe any previous user before saving new one
//   localStorage.setItem('token',    res.data.token);
//   localStorage.setItem('userRole', 'daycare');
//   localStorage.setItem('user',     JSON.stringify(res.data.user));
//   return res;
// };

// export const logout = () => {
//   clearSession(); // wipe everything so next user starts completely fresh
//   window.location.href = '/login';
// };

// // ─── PROFILE ──────────────────────────────────────────────────────────────────

// export const getProfile = (parentId) =>
//   API.get(`/parents/${parentId}/profile`);

// export const updateProfile = (fields) =>
//   API.put('/parents/profile', fields);

// // ─── DAYCARES (Parent search) ──────────────────────────────────────────────────

// export const searchDaycares = (params = {}) => {
//   const clean = Object.fromEntries(
//     Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
//   );
//   return API.get('/parents/search-daycares', { params: clean });
// };

// export const getDaycareById = (id) =>
//   API.get(`/daycares/${id}`);

// // ─── SAVED / FAVORITES ────────────────────────────────────────────────────────

// export const getSavedDaycares = (parentId) =>
//   API.get(`/parents/${parentId}/saved-daycares`);

// export const saveDaycare = (parentId, daycareId) =>
//   API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

// export const unsaveDaycare = (parentId, daycareId) =>
//   API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// // ─── CHILDREN ─────────────────────────────────────────────────────────────────

// export const getChildren = (parentId) =>
//   API.get(`/parents/${parentId}/children`);

// export const addChild = (parentId, child) =>
//   API.post(`/parents/${parentId}/children`, child);

// export const updateChild = (parentId, childId, fields) =>
//   API.put(`/parents/${parentId}/children/${childId}`, fields);

// // ─── ENROLLMENT REQUESTS ──────────────────────────────────────────────────────

// export const requestEnrollment = (parentId, childId, daycareId) =>
//   API.post(`/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`);

// export const getRequests = (parentId) =>
//   API.get(`/parents/${parentId}/requests`);

// export const cancelRequest = (parentId, requestId) =>
//   API.delete(`/parents/${parentId}/requests/${requestId}`);

// // ─── REVIEWS ──────────────────────────────────────────────────────────────────

// export const submitReview = (parentId, daycareId, rating, comment = '') =>
//   API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
//     rating,
//     ...(comment ? { comment } : {}),
//   });

// // ─── SUPPORT MESSAGES ─────────────────────────────────────────────────────────

// export const sendSupportMessage = (subject, message) =>
//   API.post('/parents/messages', { subject, message });

// // ─── ACCOUNT ──────────────────────────────────────────────────────────────────

// export const deleteAccount = (parentId) =>
//   API.delete(`/parents/${parentId}/delete`);

// export default API;
import axios from "axios";

// ─── Axios instances — two backends ───────────────────────────────────────────
// Parent/Auth backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "ngrok-skip-browser-warning": "true" },
});

// Daycare backend
const DAYCARE_API = axios.create({
  baseURL: import.meta.env.VITE_DAYCARE_API_URL || "http://localhost:5001",
  headers: { "ngrok-skip-browser-warning": "true" },
});

// ─── Request interceptors — attach token automatically ────────────────────────
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
};

API.interceptors.request.use(attachToken);
DAYCARE_API.interceptors.request.use(attachToken);

// ─── Response interceptors — handle expired token ─────────────────────────────
const handleAuthError = (error) => {
  if (error.response?.status === 401 && localStorage.getItem("token")) {
    clearSession();
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

API.interceptors.response.use((r) => r, handleAuthError);
DAYCARE_API.interceptors.response.use((r) => r, handleAuthError);

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!getToken();

// Wipes ALL session data — no old user bleeds into a new session
const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("pendingUser");
};

// ─── AUTH (parent backend) ────────────────────────────────────────────────────

export const registerParent = (data) => API.post("/auth/register/parent", data);

export const registerNursery = (data) =>
  API.post("/auth/register/daycare", data);

export const verifyOtp = (email, code, role) =>
  API.post("/auth/verify-otp", { email, code, role });

export const forgotPassword = (email, role) =>
  API.post("/auth/forgot-password", { email, role });

export const resetPassword = (email, role, code, newPassword) =>
  API.post("/auth/reset-password", { email, role, code, newPassword });

export const loginParent = async (data) => {
  const res = await API.post("/auth/login", { ...data, role: "parent" });
  clearSession();
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userRole", "parent");
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res;
};

export const loginDaycare = async (data) => {
  const res = await API.post("/auth/login", { ...data, role: "daycare" });
  clearSession();
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userRole", "daycare");
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res;
};

export const logout = () => {
  clearSession();
  window.location.href = "/login";
};

// ─── PARENT PROFILE (parent backend) ─────────────────────────────────────────

export const getProfile = (parentId) => API.get(`/parents/${parentId}/profile`);

export const updateProfile = (fields) => API.put("/parents/profile", fields);

// ─── PARENT — DAYCARES SEARCH (parent backend) ───────────────────────────────

export const searchDaycares = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );
  return API.get("/parents/search-daycares", { params: clean });
};

export const getDaycareById = (id) => API.get(`/daycares/${id}`);

// ─── PARENT — SAVED / FAVORITES (parent backend) ─────────────────────────────

export const getSavedDaycares = (parentId) =>
  API.get(`/parents/${parentId}/saved-daycares`);

export const saveDaycare = (parentId, daycareId) =>
  API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

export const unsaveDaycare = (parentId, daycareId) =>
  API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// ─── PARENT — CHILDREN (parent backend) ──────────────────────────────────────

export const getChildren = (parentId) =>
  API.get(`/parents/${parentId}/children`);

export const addChild = (parentId, child) =>
  API.post(`/parents/${parentId}/children`, child);

export const updateChild = (parentId, childId, fields) =>
  API.put(`/parents/${parentId}/children/${childId}`, fields);

// ─── PARENT — ENROLLMENT REQUESTS (parent backend) ───────────────────────────

export const requestEnrollment = (parentId, childId, daycareId) =>
  API.post(
    `/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`,
  );

export const getRequests = (parentId) =>
  API.get(`/parents/${parentId}/requests`);

export const cancelRequest = (parentId, requestId) =>
  API.delete(`/parents/${parentId}/requests/${requestId}`);

// ─── PARENT — REVIEWS (parent backend) ───────────────────────────────────────

export const submitReview = (parentId, daycareId, rating, comment = "") =>
  API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
    rating,
    ...(comment ? { comment } : {}),
  });

// ─── PARENT — SUPPORT (parent backend) ───────────────────────────────────────

export const sendSupportMessage = (subject, message) =>
  API.post("/parents/messages", { subject, message });

// ─── PARENT — ACCOUNT (parent backend) ───────────────────────────────────────

export const deleteAccount = (parentId) =>
  API.delete(`/parents/${parentId}/delete`);

// ─── DAYCARE — PROFILE (daycare backend) ─────────────────────────────────────

/** GET /api/daycares/profile/me — full logged-in daycare profile */
export const getDaycareProfile = () =>
  DAYCARE_API.get("/api/daycares/profile/me");

/** PUT /api/auth/daycare/complete-profile — FormData with all profile fields */
export const completeDaycareProfile = (formData) =>
  DAYCARE_API.put("/api/daycares/profile/me", formData);

// ─── DAYCARE — STATS & DATA (daycare backend) ─────────────────────────────────

export const getDaycareStats = () => DAYCARE_API.get("/api/daycares/my-stats");

export const getDaycareRequests = () =>
  DAYCARE_API.get("/api/daycares/my-requests");

export const getDaycareChildren = () =>
  DAYCARE_API.get("/api/daycares/my-children");

export const getDaycareReviews = () =>
  DAYCARE_API.get("/api/daycares/my-reviews");

export const getDaycareActivities = () =>
  DAYCARE_API.get("/api/daycares/my-activities");

export const addDaycareActivity = (data) =>
  DAYCARE_API.post("/api/daycares/my-activities", data);

export const acceptRequest = (requestId) =>
  DAYCARE_API.put(`/api/daycares/requests/${requestId}/accept`);

export const rejectRequest = (requestId) =>
  DAYCARE_API.put(`/api/daycares/requests/${requestId}/reject`);

// ─── PUBLIC (daycare backend) ─────────────────────────────────────────────────

export const getPublicDaycares = () => DAYCARE_API.get("/api/public/daycares");

export const getFeaturedDaycares = () =>
  DAYCARE_API.get("/api/public/featured");

export const getPublicCities = () => DAYCARE_API.get("/api/public/cities");

export default API;
export { DAYCARE_API };
