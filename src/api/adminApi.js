import apiClient from './apiClient';

export const adminApi = {
  // Matches AdminController.stats()
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  // Matches AdminController.createClerk()
  createClerk: async (clerkData) => {
    const response = await apiClient.post('/admin/create-clerk', clerkData);
    return response.data;
  },

  // Matches AdminController.customers()
  getCustomers: async () => {
    const response = await apiClient.get('/admin/customers');
    return response.data;
  },

  // Matches AdminController.adjustStock()
  adjustStock: async (partId, quantity) => {
    const response = await apiClient.patch(`/admin/inventory/${partId}/stock?quantity=${quantity}`);
    return response.data;
  }
};