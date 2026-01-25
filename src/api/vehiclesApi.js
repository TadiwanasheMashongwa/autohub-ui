import apiClient from './apiClient';

export const vehiclesApi = {
  // Consumes ENDPOINT #27
  getMakes: async () => {
    const response = await apiClient.get('/vehicles/makes');
    return response.data;
  },

  // Consumes ENDPOINT #28
  getModels: async (make) => {
    const response = await apiClient.get(`/vehicles/models`, { params: { make } });
    return response.data;
  },

  // Consumes ENDPOINT #29
  getYearRanges: async (make, model) => {
    const response = await apiClient.get(`/vehicles/years`, { params: { make, model } });
    return response.data;
  },

  // Consumes GET /api/v1/vehicles (to find the final ID)
  getAll: async () => {
    const response = await apiClient.get('/vehicles');
    return response.data;
  }
};