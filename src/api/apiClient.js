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
}, (error) => Promise.reject(error));

// Response Interceptor: Rotation & Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle Token Expiration (401) + Rotation
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const currentRefreshToken = localStorage.getItem('refreshToken');
        
        // Silicon Valley Grade: Rotation logic
        // We call the /auth/refresh endpoint defined in your controller
        const res = await axios.post('/api/v1/auth/refresh', { refreshToken: currentRefreshToken });
        
        // Capture BOTH new tokens from the rotation
        const { accessToken, refreshToken } = res.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Rotation failed (likely reuse detection or expiry)
        localStorage.clear();
        window.location.href = '/login?expired=true';
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.show("Access Denied: Terminal Restricted", 'error');
    } 
    
    // 3. Handle Generic Errors
    else {
      const msg = error.response?.data?.message || "Connection Interrupted";
      toast.show(msg, 'error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;