import apiClient from './apiClient';

export const adminApi = {
  // PHASE 1: CATEGORY MANAGEMENT
  getCategories: async () => (await apiClient.get('/v1/categories')).data,
  createCategory: async (category) => (await apiClient.post('/v1/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/v1/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/v1/categories/${id}`)).data,

  // PHASE 1: VEHICLE COMPATIBILITY
  getVehicles: async () => (await apiClient.get('/v1/vehicles')).data,
  createVehicle: async (vehicle) => (await apiClient.post('/v1/vehicles', vehicle)).data,
  updateVehicle: async (id, vehicle) => (await apiClient.put(`/v1/vehicles/${id}`, vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/v1/vehicles/${id}`)).data,
  
  // CORE STATS (To keep dashboard loaded)
  getStats: async () => (await apiClient.get('/admin/stats')).data,
};