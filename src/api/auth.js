import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.0.154:5000',
});

export const registerParent = (data) =>
  API.post('/auth/register/parent', data);

export const registerNursery = (data) =>
  API.post('/auth/register/daycare', data);

export const searchDaycares = (params) =>
  API.get('/parents/search-daycares', {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

export const loginParent = (data) =>
  API.post('/auth/login/parent', data);

export const loginDaycare = (data) =>
  API.post('/auth/login/daycare', data);