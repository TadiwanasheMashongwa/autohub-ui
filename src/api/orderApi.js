import apiClient from './apiClient';

export const orderApi = {
  /**
   * Fetches all orders with optional status filtering.
   */
  getOrders: async (params) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  /**
   * Updates the status of an order.
   * e.g., PENDING -> PICKED
   */
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  /**
   * Fetches details for a specific order.
   */
  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }
};