import apiClient from './apiClient';

export const adminApi = {
  // --- PHASE 1.1: CATEGORIES ---
  getCategories: async () => (await apiClient.get('/categories')).data,
  createCategory: async (category) => (await apiClient.post('/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,

  // --- PHASE 1.2: VEHICLE ARCHITECTURE (Audit #5.2-5.4) ---
  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  getMakes: async () => (await apiClient.get('/vehicles/makes')).data,
  getModels: async (make) => (await apiClient.get(`/vehicles/models?make=${make}`)).data,
  getYears: async (make, model) => (await apiClient.get(`/vehicles/years?make=${make}&model=${model}`)).data,
  
  createVehicle: async (vehicle) => (await apiClient.post('/vehicles', vehicle)).data,
  updateVehicle: async (id, vehicle) => (await apiClient.put(`/vehicles/${id}`, vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,
  
  // --- OPS & STATS ---
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
};