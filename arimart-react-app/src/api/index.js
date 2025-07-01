import axios from 'axios';

const API_KEY = 'arimart_secret_api_key_123';

const API = axios.create({
  baseURL: 'http://localhost:5015/api',
  headers: {
    'X-Api-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((req) => {
  try {
    const profile = localStorage.getItem('Profile');

    if (profile) {
      const { token } = JSON.parse(profile);
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error("Error parsing localStorage Profile:", err);
  }

  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;
