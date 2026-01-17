import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useCart } from '../../context/CartContext';
import { Navigate } from 'react-router-dom';

// Replace with your actual Stripe Public Key from Dashboard
const stripePromise = loadStripe('pk_test_your_key_here');

export default function CheckoutPage() {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return <Navigate to="/warehouse" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-dark p-8 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Final <span className="text-brand-accent">Settlement</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Transaction ID: {cart.id.substring(0,8).toUpperCase()}</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Order Summary</h3>
            {cart.items.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-white/5 text-sm">
                    <span className="text-slate-300">{item.partName} x{item.quantity}</span>
                    <span className="text-white font-mono">${item.price.toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between pt-4 text-xl font-black text-brand-accent uppercase">
                <span>Total Due</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}