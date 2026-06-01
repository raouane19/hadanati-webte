import axios from "axios";

// ─── Axios instance — one backend ─────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "ngrok-skip-browser-warning": "true" },
});

// ─── Request interceptor — attach token automatically ─────────────────────────
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
};

API.interceptors.request.use(attachToken);

// ─── Response interceptor — handle expired token ──────────────────────────────
const handleAuthError = (error) => {
  if (error.response?.status === 401 && localStorage.getItem("token")) {
    clearSession();
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

API.interceptors.response.use((r) => r, handleAuthError);

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

// Wipes ALL session data
const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("pendingUser");
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

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
  window.location.href = "/hadanati-login"; // ✅ instead of "/login"
};

// ─── PARENT PROFILE ───────────────────────────────────────────────────────────

export const getProfile = (parentId) => API.get(`/parents/${parentId}/profile`);

export const updateProfile = (fields) => API.put("/parents/profile", fields);

// ─── PARENT — DAYCARES SEARCH ─────────────────────────────────────────────────

export const searchDaycares = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );
  return API.get("/parents/search-daycares", { params: clean });
};

export const getDaycareById = (id) => API.get(`/daycares/${id}`);

// ─── PARENT — SAVED / FAVORITES ───────────────────────────────────────────────

export const getSavedDaycares = (parentId) =>
  API.get(`/parents/${parentId}/saved-daycares`);

export const saveDaycare = (parentId, daycareId) =>
  API.post(`/parents/${parentId}/save-daycare/${daycareId}`);

export const unsaveDaycare = (parentId, daycareId) =>
  API.delete(`/parents/${parentId}/saved-daycares/${daycareId}`);

// ─── PARENT — CHILDREN ────────────────────────────────────────────────────────

export const getChildren = (parentId) =>
  API.get(`/parents/${parentId}/children`);

export const addChild = (parentId, child) =>
  API.post(`/parents/${parentId}/children`, child);

export const updateChild = (parentId, childId, fields) =>
  API.put(`/parents/${parentId}/children/${childId}`, fields);

// ─── PARENT — ENROLLMENT REQUESTS ────────────────────────────────────────────

export const requestEnrollment = (parentId, childId, daycareId) =>
  API.post(
    `/parents/${parentId}/children/${childId}/request-daycare/${daycareId}`,
  );

export const getRequests = (parentId) =>
  API.get(`/parents/${parentId}/requests`);

export const cancelRequest = (parentId, requestId) =>
  API.delete(`/parents/${parentId}/requests/${requestId}`);

// ─── PARENT — REVIEWS ─────────────────────────────────────────────────────────

export const submitReview = (parentId, daycareId, rating, comment = "") =>
  API.post(`/parents/${parentId}/review-daycare/${daycareId}`, {
    rating,
    ...(comment ? { comment } : {}),
  });

// ─── PARENT — SUPPORT ─────────────────────────────────────────────────────────

export const sendSupportMessage = (subject, message) =>
  API.post("/parents/messages", { subject, message });

// ─── PARENT — ACCOUNT ─────────────────────────────────────────────────────────

export const deleteAccount = (parentId) =>
  API.delete(`/parents/${parentId}/delete`);

// ─── DAYCARE — PROFILE ────────────────────────────────────────────────────────

/** POST /daycares/complete-profile — FormData with all profile fields + certificate file */
export const completeDaycareProfile = (formData) =>
  API.post("/daycares/complete-profile", formData);

/** GET /daycares/profile/me — full logged-in daycare profile */
export const getDaycareProfile = () =>
  API.get("/daycares/profile/me");

/** PUT /daycares/profile/me — update profile fields (JSON) */
export const updateDaycareProfile = (fields) =>
  API.put("/daycares/profile/me", fields);

// ─── DAYCARE — FILE UPLOADS ───────────────────────────────────────────────────

export const uploadDaycareGallery = (formData) =>
  API.post("/daycares/upload/gallery", formData);

export const uploadDaycareCertification = (formData) =>
  API.post("/daycares/upload/certification", formData);

export const uploadDaycareProfileImage = (formData) =>
  API.post("/daycares/upload/profile-image", formData);

// ─── DAYCARE — STATS & DATA ───────────────────────────────────────────────────

export const getDaycareStats = () =>
  API.get("/daycares/my-stats");

export const getDaycareRequests = () =>
  API.get("/daycares/my-requests");

export const getDaycareChildren = () =>
  API.get("/daycares/my-children");

export const getDaycareReviews = () =>
  API.get("/daycares/my-reviews");

export const getDaycareActivities = () =>
  API.get("/daycares/my-activities");

export const addDaycareActivity = (data) =>
  API.post("/daycares/my-activities", data);

export const updateDaycareActivity = (id, data) =>
  API.put(`/daycares/my-activities/${id}`, data);

export const deleteDaycareActivity = (id) =>
  API.delete(`/daycares/my-activities/${id}`);

// ─── DAYCARE — REQUESTS ───────────────────────────────────────────────────────

export const acceptRequest = (requestId) =>
  API.put(`/daycares/requests/${requestId}/accept`);

export const rejectRequest = (requestId) =>
  API.put(`/daycares/requests/${requestId}/reject`);

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

export const getPublicDaycares = () => API.get("/daycares");

export const getPublicDaycareById = (id) => API.get(`/daycares/${id}`);

export const getDaycareRating = (id) => API.get(`/daycares/${id}/rating`);

export const getPublicDaycareActivities = (id) =>
  API.get(`/daycares/${id}/activities`);

export const getPublicDaycareReviews = (id, page = 1, limit = 10) =>
  API.get(`/daycares/${id}/reviews`, { params: { page, limit } });

export const deleteDaycareAccount = () =>
  API.delete("/daycares/me");



export default API;
export { API as DAYCARE_API };