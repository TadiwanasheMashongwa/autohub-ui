import apiClient from './apiClient';

export const partsApi = {
  getParts: async (page = 0, filters = {}) => {
    // Silicon Valley Grade: Clean params to avoid sending 'undefined' strings
    const params = { page, size: 12 };
    if (filters.brand) params.brand = filters.brand;
    if (filters.condition) params.condition = filters.condition;

    const response = await apiClient.get('/parts', { params });
    return response.data;
  },

  searchParts: async (query, page = 0, filters = {}) => {
    const params = { query, page, size: 12 };
    if (filters.brand) params.brand = filters.brand;
    if (filters.condition) params.condition = filters.condition;

    const response = await apiClient.get('/parts/search', { params });
    return response.data;
  },

  getPartsByCategory: async (categoryId, page = 0, filters = {}) => {
    const params = { page, size: 12 };
    if (filters.brand) params.brand = filters.brand;
    if (filters.condition) params.condition = filters.condition;

    const response = await apiClient.get(`/parts/category/${categoryId}`, { params });
    return response.data;
  },

  getPartDetails: async (id) => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  },

  getPartsByVehicle: async (vehicleId, page = 0) => {
    const response = await apiClient.get(`/parts/vehicle/${vehicleId}`, { 
      params: { page, size: 12 } 
    });
    return response.data;
  }
};