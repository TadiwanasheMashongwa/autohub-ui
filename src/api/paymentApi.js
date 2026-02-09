import apiClient from './apiClient';

export const paymentApi = {
  /**
   * Phase 6: Payment Initiation
   * Tells the backend to create a Stripe PaymentIntent for a specific order.
   */
  initiatePayment: async (orderId) => {
    // Backend: PaymentController.initiatePayment(orderId)
    const response = await apiClient.post(`/payments/initiate/${orderId}`);
    return response.data; // Returns { clientSecret: '...' }
  },

  /**
   * Phase 6: Payment Confirmation
   * Notifies our Railway DB that Stripe has successfully charged the user.
   */
  confirmPaymentServerSide: async (orderId, paymentIntentId) => {
    // Backend: PaymentController.confirmPayment(...)
    const response = await apiClient.post('/payments/confirm', {
      orderId,
      paymentIntentId
    });
    return response.data;
  }
};