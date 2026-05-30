
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
  API.post("/daycares/complete-profile", formData);

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
