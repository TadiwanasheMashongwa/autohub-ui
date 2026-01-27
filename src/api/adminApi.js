import apiClient from './apiClient';

export const adminApi = {
  // --- PHASE 1: STRUCTURE ---
  getCategories: async (query = '') => (await apiClient.get(query ? `/categories/search?query=${query}` : '/categories')).data,
  createCategory: async (category) => (await apiClient.post('/categories', category)).data,
  updateCategory: async (id, category) => (await apiClient.put(`/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await apiClient.delete(`/categories/${id}`)).data,
  getVehicles: async () => (await apiClient.get('/vehicles')).data,
  createVehicle: async (vehicle) => (await apiClient.post('/vehicles', vehicle)).data,
  deleteVehicle: async (id) => (await apiClient.delete(`/vehicles/${id}`)).data,

  // --- PHASE 2: CATALOG & INVENTORY ---
  getParts: async (q = '') => (await apiClient.get(q ? `/parts/search?query=${q}` : '/parts')).data,
  createPart: async (part) => (await apiClient.post('/parts', part)).data,
  updatePart: async (id, part) => (await apiClient.put(`/parts/${id}`, part)).data,
  deletePart: async (id) => (await apiClient.delete(`/parts/${id}`)).data,
  adjustStock: async (id, qty) => (await apiClient.patch(`/admin/inventory/${id}/stock?quantity=${qty}`)).data,
  addCompatibility: async (partId, vehicleId) => (await apiClient.post(`/parts/${partId}/compatibility/${vehicleId}`)).data,

  // --- PHASE 3: STAFF & CUSTOMERS ---
  getClerks: async (query = '') => (await apiClient.get(query ? `/admin/clerks/search?query=${query}` : '/admin/clerks')).data,
  createClerk: async (data) => (await apiClient.post('/admin/create-clerk', data)).data,
  deleteClerk: async (id) => (await apiClient.delete(`/admin/clerks/${id}`)).data,
  getCustomers: async () => (await apiClient.get('/admin/customers')).data,
  getStats: async () => (await apiClient.get('/admin/stats')).data,

  // --- PHASE 4: BRAND SENTIMENT ---
  getReviews: async (negativeOnly = false) => (await apiClient.get(`/admin/reviews?negativeOnly=${negativeOnly}`)).data,
  deleteReview: async (id) => (await apiClient.delete(`/admin/reviews/${id}`)).data,

  // --- PHASE 5: FINANCIALS & LOGISTICS (NEW) ---
  getActiveOrders: async () => (await apiClient.get('/admin/orders/active')).data,
  updateLogistics: async (id, data) => (await apiClient.patch(`/admin/orders/${id}/logistics`, data)).data,
  processRefund: async (id) => (await apiClient.post(`/admin/orders/${id}/refund`)).data,

  getActiveOrders: async () => (await apiClient.get('/admin/orders/active')).data,
  verifyPick: async (id, barcodeMap) => (await apiClient.post(`/admin/orders/${id}/verify-pick`, barcodeMap)).data,
  updateLogistics: async (id, data) => (await apiClient.patch(`/admin/orders/${id}/logistics`, data)).data,
  processRefund: async (id) => (await apiClient.post(`/admin/orders/${id}/refund`)).data,
};