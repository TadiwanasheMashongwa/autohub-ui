import apiClient from './apiClient';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data; 
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  verifyMfa: async (data) => {
    const response = await apiClient.post('/auth/verify-mfa', data);
    return response.data;
  },

  getProfile: async () => {
    // Silicon Valley Grade: Identity validation endpoint
    // Ensure you have a corresponding GET /api/v1/auth/me in your Controller
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async (email) => {
    return apiClient.post('/auth/logout', { email });
  },

  initiatePasswordReset: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  completePasswordReset: async (token, newPassword) => {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  refreshToken: async (token) => {
    return apiClient.post('/auth/refresh', { refreshToken: token });
  }
};