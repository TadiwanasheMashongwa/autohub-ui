import apiClient from './apiClient';

export const categoryApi = {
  // Consumes CategoryController @GetMapping
  getAllCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  }
};