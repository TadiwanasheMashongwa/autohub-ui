import apiClient from './apiClient';

export const partApi = {
  // Consumes PartController @GetMapping (Public)
  getParts: async (page = 0, size = 12) => {
    const response = await apiClient.get(`/parts?page=${page}&size=${size}`);
    return response.data;
  },

  // Matches @Query in PartRepository for name, brand, sku, oemNumber
  searchParts: async (query, page = 0, size = 12) => {
    const response = await apiClient.get(`/parts/search?query=${query}&page=${page}&size=${size}`);
    return response.data;
  },

  // Consumes findByCategoryId
  getPartsByCategory: async (categoryId, page = 0, size = 12) => {
    const response = await apiClient.get(`/parts/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Consumes findByCompatibleVehiclesId
  getPartsByVehicle: async (vehicleId, page = 0, size = 12) => {
    const response = await apiClient.get(`/parts/vehicle/${vehicleId}?page=${page}&size=${size}`);
    return response.data;
  },

  getPartDetails: async (id) => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  }
};