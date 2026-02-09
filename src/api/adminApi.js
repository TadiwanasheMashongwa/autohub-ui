import apiClient from './apiClient';

export const adminApi = {
  // --- CATALOG & INVENTORY ---
  getCategories: async (query = '') => (await apiClient.get(query ? `/categories/search?query=${query}` : '/categories')).data,
  createCategory: async (category) => (await apiClient.post('/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,
  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  createVehicle: async (vehicle) => (await apiClient.post('/vehicles', vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,
  getParts: async (q = '') => (await apiClient.get(q ? `/parts/search?query=${q}` : '/parts')).data,
  createPart: async (part) => (await apiClient.post('/parts', part)).data,
  updatePart: async (id, part) => (await apiClient.put(`/parts/${id}`, part)).data,
  deletePart: async (id) => (await apiClient.delete(`/parts/${id}`)).data,
  adjustStock: async (id, qty) => (await apiClient.patch(`/admin/inventory/${id}/stock?quantity=${qty}`)).data,

  // --- STAFF & CUSTOMERS ---
  getClerks: async (query = '') => (await apiClient.get(query ? `/admin/clerks/search?query=${query}` : '/admin/clerks')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
  getCustomers: async () => (await apiClient.get('/admin/customers')).data,
  getStats: async () => (await apiClient.get('/admin/stats')).data,
  getReviews: async (negativeOnly = false) => (await apiClient.get(`/admin/reviews?negativeOnly=${negativeOnly}`)).data,

  // --- WAREHOUSE & LOGISTICS ---
  // 🛠️ Hits the /active endpoint (Operational Queue)
  getActiveOrders: async () => (await apiClient.get('/orders/active')).data,
  
  // 🛠️ Transitions status to PICKED
  verifyPick: async (id) => (await apiClient.patch(`/orders/${id}/status`, { status: 'PICKED' })).data,
  
  // 🛠️ Updates courier info and marks as SHIPPED
  updateLogistics: async (id, data) => (await apiClient.patch(`/orders/${id}/logistics`, data)).data,
  
  processRefund: async (id) => (await apiClient.post(`/orders/${id}/refund`)).data,
};