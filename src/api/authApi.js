import apiClient from './apiClient';
import { AUTH_URLS } from './endpoints';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_URLS.LOGIN, credentials);
    return response.data; 
  },

  register: async (userData) => {
    // Points to @PostMapping("/register") using RegisterRequest DTO
    const response = await apiClient.post(AUTH_URLS.REGISTER, userData);
    return response.data;
  },

  verifyMfa: async (data) => {
    // Matches MFA endpoint in your AuthenticationController
    const response = await apiClient.post(AUTH_URLS.VERIFY_MFA, data);
    return response.data;
  },

  logout: async () => {
    return apiClient.post(AUTH_URLS.LOGOUT);
  },

  initiatePasswordReset: async (email) => {
    return apiClient.post(AUTH_URLS.FORGOT_PASSWORD, { email });
  },

  completePasswordReset: async (token, newPassword) => {
    return apiClient.post(AUTH_URLS.RESET_PASSWORD, { token, newPassword });
  },

  refreshToken: async (token) => {
    return apiClient.post(AUTH_URLS.REFRESH, { refreshToken: token });
  }
};