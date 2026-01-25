import apiClient from './apiClient';

/**
 * Silicon Valley Grade: Vehicle Compatibility Service
 * Explicit endpoints for the multi-step fitment funnel.
 */
export const vehiclesApi = {
  // Consumes VehicleController @GetMapping("/makes")
  getMakes: async () => {
    const response = await apiClient.get('/vehicles/makes');
    return response.data;
  },

  // Consumes VehicleController @GetMapping("/models")
  getModels: async (make) => {
    const response = await apiClient.get('/vehicles/models', { params: { make } });
    return response.data;
  },

  // Consumes VehicleController @GetMapping("/years")
  getYearRanges: async (make, model) => {
    const response = await apiClient.get('/vehicles/years', { params: { make, model } });
    return response.data;
  },

  // Consumes GET /api/v1/vehicles (to resolve final ID mapping)
  getAll: async () => {
    const response = await apiClient.get('/vehicles');
    return response.data;
  }
};