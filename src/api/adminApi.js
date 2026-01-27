import apiClient from './apiClient';

export const adminApi = {
  // --- OPERATIONS & STATS ---
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
  getCustomers: async () => (await apiClient.get('/admin/customers')).data,

  // --- PHASE 1: CATEGORY ARCHITECTURE ---
  getCategories: async () => (await apiClient.get('/v1/categories')).data,
  createCategory: async (cat) => (await apiClient.post('/v1/categories', cat)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/v1/categories/${id}`)).data,

  // --- PHASE 1: VEHICLE MATRIX ---
  getVehicles: async () => (await apiClient.get('/v1/vehicles')).data,
  createVehicle: async (v) => (await apiClient.post('/v1/vehicles', v)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/v1/vehicles/${id}`)).data,

  // --- PHASE 2: CATALOG MASTER ---
  getInventory: async () => (await apiClient.get('/v1/parts')).data, // Pageable handled by default
  adjustStock: async (id, qty) => (await apiClient.patch(`/admin/inventory/${id}/stock?quantity=${qty}`)).data,

  // --- PHASE 4: REVIEWS & SENTIMENT ---
  getReviewsByPart: async (partId) => (await apiClient.get(`/v1/reviews/part/${partId}`)).data
};