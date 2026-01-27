import apiClient from './apiClient';

export const adminApi = {
  // --- PHASE 1: CATEGORIES & VEHICLES ---
  getCategories: async (query = '') => {
    const path = query ? `/categories/search?query=${query}` : '/categories';
    const response = await apiClient.get(path);
    return response.data;
  },
  createCategory: async (category) => (await apiClient.post('/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,

  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  createVehicle: async (vehicle) => (await apiClient.post('/vehicles', vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,

  // --- PHASE 3: STAFF GOVERNANCE ---
  getClerks: async (query = '') => {
    const path = query ? `/admin/clerks/search?query=${query}` : '/admin/clerks';
    const response = await apiClient.get(path);
    return response.data;
  },
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
  deleteClerk: async (id) => (await apiClient.delete(`/admin/clerks/${id}`)).data,

  // --- STATS & CUSTOMERS ---
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  getCustomers: async () => (await apiClient.get('/admin/customers')).data,
};