import axios from 'axios';
import { toast } from '../context/NotificationContext';

const apiClient = axios.create({
  // Force absolute URL to prevent Vite from hitting the wrong port
  baseURL: 'http://localhost:8080/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isValidationCall = originalRequest.url.includes('/auth/me');

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const currentRefreshToken = localStorage.getItem('refreshToken');
        if (!currentRefreshToken) throw new Error("No refresh token");

        const res = await axios.post('http://localhost:8080/api/v1/auth/refresh', { 
          refreshToken: currentRefreshToken 
        });
        
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        if (!isValidationCall) window.location.href = '/login?expired=true';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      toast.show("Access Denied: Terminal Restricted", 'error');
    } else if (!isValidationCall && error.response?.status !== 401) {
      const msg = error.response?.data?.message || "Internal System Error";
      toast.show(msg, 'error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;