import apiClient from './apiClient';

export const paymentApi = {
  /**
   * 1. Request a PaymentIntent from the backend.
   * Includes an Idempotency-Key to prevent duplicate intents for the same cart.
   */
  createPaymentIntent: async (cartId, idempotencyKey) => {
    const response = await apiClient.post('/payments/create-intent', 
      { cartId }, 
      {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      }
    );
    return response.data; // { clientSecret: '...' }
  },

  /**
   * 2. Confirm the payment status after Stripe processing.
   */
  confirmPaymentStatus: async (paymentIntentId) => {
    const response = await apiClient.get(`/payments/status/${paymentIntentId}`);
    return response.data;
  }
};