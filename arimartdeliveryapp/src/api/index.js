import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5015/api',
  headers: {
    'X-Api-Key': 'arimart_secret_api_key_123',
    'Content-Type': 'application/json',
  },
});

// ✅ Token Injection Interceptor
API.interceptors.request.use(
  (req) => {
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        const profile = localStorage.getItem('Profile');
        if (profile) {
          token = JSON.parse(profile)?.token || null;
        }
      }
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('🚨 Token parsing error:', err);
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
