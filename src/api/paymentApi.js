import apiClient from './apiClient';

export const partsApi = {
  /**
   * Silicon Valley Grade: Universal Param Mapping
   * We pass the full filter object to every endpoint to ensure 
   * Brand and Condition are never "dropped" during transitions.
   */
  getParts: async (page = 0, filters = {}) => {
    const response = await apiClient.get('/parts', { 
      params: { 
        page, 
        size: 12, 
        brand: filters.brand || undefined, 
        condition: filters.condition || undefined 
      } 
    });
    return response.data;
  },

  searchParts: async (query, page = 0, filters = {}) => {
    const response = await apiClient.get('/parts/search', { 
      params: { 
        query, 
        page, 
        brand: filters.brand || undefined, 
        condition: filters.condition || undefined 
      } 
    });
    return response.data;
  },

  getPartsByCategory: async (categoryId, page = 0, filters = {}) => {
    const response = await apiClient.get(`/parts/category/${categoryId}`, { 
      params: { 
        page, 
        brand: filters.brand || undefined, 
        condition: filters.condition || undefined 
      } 
    });
    return response.data;
  },

  getPartDetails: async (id) => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  },

  getPartsByVehicle: async (vehicleId, page = 0) => {
    const response = await apiClient.get(`/parts/vehicle/${vehicleId}`, { params: { page } });
    return response.data;
  }
};