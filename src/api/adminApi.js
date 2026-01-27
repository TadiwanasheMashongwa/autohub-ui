import apiClient from './apiClient';

export const adminApi = {
  // PHASE 1: CATEGORY MANAGEMENT (Fixed Paths)
  getCategories: async () => (await apiClient.get('/categories')).data,
  createCategory: async (category) => (await apiClient.post('/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,

  // PHASE 1: VEHICLE COMPATIBILITY (Fixed Paths)
  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  createVehicle: async (vehicle) => (await apiClient.post('/vehicles', vehicle)).data,
  updateVehicle: async (id, vehicle) => (await apiClient.put(`/vehicles/${id}`, vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,
  
  // STATS & CLERK (Phase 3/5)
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
};