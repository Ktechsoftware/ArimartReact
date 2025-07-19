import axios from 'axios';

const API_KEY = 'arimart_secret_api_key_123';

const API = axios.create({
  baseURL: 'https://apiari.kuldeepchaurasia.in/api',
  headers: {
    'X-Api-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// ✅ Unified token injection interceptor
API.interceptors.request.use((req) => {
  try {
    // Prefer 'token' over old 'Profile'
    let token = localStorage.getItem('token');

    // Fallback: extract token from 'Profile' if needed
    if (!token) {
      const profile = localStorage.getItem('Profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        token = parsed?.token;
      }
    }

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('Error setting Authorization header:', err);
  }

  return req;
}, (error) => Promise.reject(error));

export default API;
