import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentApi } from '../../api/paymentApi';
import { useCart } from '../../context/CartContext';
import { toast } from '../../context/NotificationContext';
import { getIdempotencyKey, clearIdempotencyKey } from '../../utils/idempotency';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Generate or retrieve the unique key for this specific cart transaction
    const idempotencyKey = getIdempotencyKey(`cart_${cart.id}`);

    try {
      // 1. Create Intent via Backend with Idempotency Key
      const { clientSecret } = await paymentApi.createPaymentIntent(cart.id, idempotencyKey);

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.show(result.error.message, 'error');
        setIsProcessing(false);
        // Note: We do NOT clear the key here. If they fix their card info 
        // and try again, we want the same intent, not a new one.
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          toast.show("Payment Authorized and Orchestrated", "success");
          
          // 3. Success! Now we can clear the key and refresh the app state
          clearIdempotencyKey(`cart_${cart.id}`);
          await refreshCart(); 
          navigate('/dashboard/orders/success');
        }
      }
    } catch (err) {
      // API bridge handles the toast error
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Secure Card Entry</label>
        <div className="p-4 bg-slate-900 border border-white/5 rounded-xl">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': { color: '#475569' },
              },
            },
          }} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
        <ShieldCheck className="h-4 w-4 text-brand-accent" />
        Idempotency Active: {cart?.id?.substring(0,6)}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
      >
        {isProcessing ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          `Complete Transaction $${cart?.totalPrice?.toFixed(2)}`
        )}
      </button>
    </form>
  );
}