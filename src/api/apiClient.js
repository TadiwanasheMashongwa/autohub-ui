import axios from 'axios';
import { toast } from '../context/NotificationContext';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global Error Handling & Token Refresh
apiClient.interceptors.response.use(
  (response) => {
    // Optional: Show success messages for specific methods
    if (response.config.method !== 'get' && response.data?.message) {
      toast.show(response.data.message, 'success');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || "Server connection failed";

    // 1. Handle Token Expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        // Direct axios call to avoid interceptor loop
        const res = await axios.post('/api/v1/auth/refresh-token', { refreshToken });
        
        const { accessToken } = res.data;
        localStorage.setItem('token', accessToken);
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        toast.show("Session expired. Please login again.", 'error');
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle 403 Forbidden (RBAC Failures)
    if (error.response?.status === 403) {
      toast.show("Access Denied: Insufficient permissions.", 'error');
    } 
    
    // 3. Handle General Errors (Stock issues, Validation, etc)
    else {
      toast.show(errorMessage, 'error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;