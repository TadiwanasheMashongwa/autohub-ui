import apiClient from './apiClient';

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },
  
  // Matches POST /api/v1/cart/add?partId=X&quantity=Y
  addToCart: async (partId, quantity) => {
    const response = await apiClient.post('/cart/add', null, {
      params: { partId, quantity }
    });
    return response.data;
  },
  
  // Matches PUT /api/v1/cart/update/{cartItemId}?quantity=Y
  updateQuantity: async (cartItemId, quantity) => {
    const response = await apiClient.put(`/cart/update/${cartItemId}`, null, {
      params: { quantity }
    });
    return response.data;
  },
  
  // Matches DELETE /api/v1/cart/item/{id}
  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/cart/item/${itemId}`);
    return response.data;
  },
  
  // Matches DELETE /api/v1/cart/clear
  clearCart: async () => {
    await apiClient.delete('/cart/clear');
  }
};