import apiClient from './apiClient';

export const adminApi = {
  // Fetches revenue, order counts, and active user stats
  getSystemMetrics: async () => {
    const response = await apiClient.get('/admin/metrics/summary');
    return response.data;
  },

  // Fetches daily revenue data for the chart
  getRevenueStats: async () => {
    const response = await apiClient.get('/admin/metrics/revenue');
    return response.data;
  },

  // Fetches stock health (Low stock items vs healthy stock)
  getWarehouseHealth: async () => {
    const response = await apiClient.get('/admin/metrics/warehouse-health');
    return response.data;
  }
};