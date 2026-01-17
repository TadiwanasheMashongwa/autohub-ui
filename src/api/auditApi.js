import apiClient from './apiClient';

export const auditApi = {
  /**
   * Fetches paginated audit logs.
   * Filters can include: userId, actionType, startDate, endDate
   */
  getLogs: async (params) => {
    const response = await apiClient.get('/admin/audit-logs', { params });
    return response.data;
  },

  /**
   * Export logs to CSV (Common requirement for Admins)
   */
  exportLogs: async () => {
    const response = await apiClient.get('/admin/audit-logs/export', { responseType: 'blob' });
    return response.data;
  }
};