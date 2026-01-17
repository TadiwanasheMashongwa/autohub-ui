import apiClient from './apiClient';
import { AUTH_URLS } from './endpoints';

export const authApi = {
  login: async (credentials) => {
    // Matches your Backend: POST /api/v1/auth/login
    const response = await apiClient.post(AUTH_URLS.LOGIN, {
      email: credentials.email,
      password: credentials.password
    });
    return response.data; 
  },

  logout: async () => {
    return apiClient.post(AUTH_URLS.LOGOUT);
  },

  verifyMfa: async (data) => {
    // ⚠️ Note: Your backend is missing this endpoint, so this calls will fail until added
    return apiClient.post(AUTH_URLS.VERIFY_MFA, data);
  },

  refreshToken: async (token) => {
    return apiClient.post(AUTH_URLS.REFRESH, { refreshToken: token });
  }
};