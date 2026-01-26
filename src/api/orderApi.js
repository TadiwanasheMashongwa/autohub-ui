import apiClient from './apiClient';

export const orderApi = {
  // NEW: Atomic Checkout - Converts Cart to Order
  checkout: async (idempotencyKey) => {
    const response = await apiClient.post('/orders/checkout', {}, {
      headers: { 'X-Idempotency-Key': idempotencyKey }
    });
    return response.data;
  },

  getOrders: async (params) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Added for History views
  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  }
};