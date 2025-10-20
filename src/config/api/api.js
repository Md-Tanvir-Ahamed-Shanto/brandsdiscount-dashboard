// api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL:  'https://dashboard.brandsdiscounts.com',
  timeout: 300000, // 5 minutes for long-running operations like eBay listings
  // headers: {
  //   'Content-Type': 'application/json',
  // }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const BASE_URL = 'https://dashboard.brandsdiscounts.com';

export { apiClient, BASE_URL };

