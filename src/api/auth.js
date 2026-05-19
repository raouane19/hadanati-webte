import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const registerParent = (data) =>
  API.post('/auth/register/parent', data);

export const registerNursery = (data) =>
  API.post('/auth/register/daycare', data);

// ✅ NEW — search daycares
export const searchDaycares = (params) =>
  API.get('/auth/search-daycares', {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });