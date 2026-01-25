import apiClient from './apiClient';

export const partsApi = {
  // Get all parts with filtering and pagination
  getParts: async (params) => {
    const response = await apiClient.get('/parts', { params });
    return response.data;
  },

  // Get a single part by ID
  getPartById: async (id) => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  },

  // Get all vehicle makes/models for the filter dropdowns
  getVehicles: async () => {
    const response = await apiClient.get('/vehicles');
    return response.data;
  },

  // Get categories for the sidebar
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  }
};