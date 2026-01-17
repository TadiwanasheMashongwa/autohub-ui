import apiClient from './apiClient';

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },
  
  addToCart: async (partId, quantity) => {
    // This triggers the Reservation logic in your backend
    const response = await apiClient.post('/cart/items', { partId, quantity });
    return response.data;
  },
  
  updateQuantity: async (itemId, quantity) => {
    const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },
  
  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },
  
  clearCart: async () => {
    await apiClient.delete('/cart');
  }
};