import apiClient from './apiClient';
import { AUTH_URLS } from './endpoints';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_URLS.LOGIN, credentials);
    return response.data; 
  },

  register: async (userData) => {
    // Matches @PostMapping("/register")
    const response = await apiClient.post(AUTH_URLS.REGISTER, userData);
    return response.data;
  },

  verifyMfa: async (data) => {
    // Matches @PostMapping("/verify-mfa") - ensure this is uncommented in Java
    const response = await apiClient.post(AUTH_URLS.VERIFY_MFA, data);
    return response.data;
  },

  logout: async () => {
    // Matches @PostMapping("/logout")
    return apiClient.post(AUTH_URLS.LOGOUT);
  },

  initiatePasswordReset: async (email) => {
    // Matches @PostMapping("/forgot-password")
    return apiClient.post(AUTH_URLS.FORGOT_PASSWORD, { email });
  },

  completePasswordReset: async (token, newPassword) => {
    // Matches @PostMapping("/reset-password")
    return apiClient.post(AUTH_URLS.RESET_PASSWORD, { token, newPassword });
  },

  refreshToken: async (token) => {
    // Matches @PostMapping("/refresh")
    return apiClient.post(AUTH_URLS.REFRESH, { refreshToken: token });
  }
};