export const API_BASE_URL = 'http://localhost:8080/api/v1';

export const AUTH_URLS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_MFA: '/auth/verify-mfa' 
};

export const ORDER_URLS = {
  CHECKOUT: '/orders/checkout',
  RETURN: (id) => `/orders/${id}/return`,
};

export const PAYMENT_URLS = {
  INITIATE: (orderId) => `/payments/initiate/${orderId}`,
  CONFIRM: '/payments/confirm',
};