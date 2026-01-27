import apiClient from './apiClient';

export const adminApi = {
  // --- PHASE 1 ---
  getCategories: async (query = '') => (await apiClient.get(query ? `/categories/search?query=${query}` : '/categories')).data,
  createCategory: async (cat) => (await apiClient.post('/categories', cat)).data,
  updateCategory: async (id, cat) => (await apiClient.put(`/categories/${id}`, cat)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,

  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  createVehicle: async (veh) => (await apiClient.post('/vehicles', veh)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,

  // --- PHASE 2: INVENTORY & CATALOG ---
  getParts: async (q = '') => (await apiClient.get(q ? `/parts/search?query=${q}` : '/parts')).data,
  createPart: async (part) => (await apiClient.post('/parts', part)).data,
  updatePart: async (id, part) => (await apiClient.put(`/parts/${id}`, part)).data,
  deletePart: async (id) => (await apiClient.delete(`/parts/${id}`)).data,
  adjustStock: async (id, qty) => (await apiClient.patch(`/admin/inventory/${id}/stock?quantity=${qty}`)).data,
  addCompatibility: async (partId, vehicleId) => (await apiClient.post(`/parts/${partId}/compatibility/${vehicleId}`)).data,
  removeCompatibility: async (partId, vehicleId) => (await apiClient.delete(`/parts/${partId}/compatibility/${vehicleId}`)).data,

  // --- PHASE 3 ---
  getClerks: async (q = '') => (await apiClient.get(q ? `/admin/clerks/search?query=${q}` : '/admin/clerks')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
  deleteClerk: async (id) => (await apiClient.delete(`/admin/clerks/${id}`)).data,
  getCustomers: async () => (await apiClient.get('/admin/customers')).data,
  getStats: async () => (await apiClient.get('/admin/stats')).data,
};