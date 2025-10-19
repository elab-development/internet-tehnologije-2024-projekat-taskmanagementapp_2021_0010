import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  // ne stavljamo withCredentials u token režimu
});

// dodavanje Authorization header-a iz localStorage (ako postoji)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // ili iz store-a
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;


