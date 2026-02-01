import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useCart } from '../../context/CartContext';
import { Navigate } from 'react-router-dom';
import { Package } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51Stp4xD1eq0ujxUIZxERSvROdoOhbp1MZvOSSTO07q1bB7T7pcETINS2l7GGOZc0Sc6lsys7XjKqv3G8cEwvXziX00ktMWr5nh');

export default function CheckoutPage() {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-brand-accent font-mono animate-pulse uppercase">Syncing Transaction Details...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <Navigate to="/warehouse" replace />;
  }

  const displayId = cart.id ? String(cart.id).substring(0, 8).toUpperCase() : "PENDING";

  return (
    <div className="min-h-screen bg-brand-dark p-8 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Final <span className="text-brand-accent">Settlement</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
            Transaction ID: {displayId}
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest border-b border-white/5 pb-2">Order Summary</h3>
          <div className="space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-black/40 rounded border border-white/5 flex-shrink-0 overflow-hidden">
                    {item.part?.imageUrl ? (
                      <img src={item.part.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-full w-full p-2 opacity-20" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 font-bold uppercase truncate max-w-[200px]">
                      {item.part?.name || item.partName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-white font-mono text-sm">
                  ${((item.part?.price || item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-6 mt-6 border-t border-white/10 text-xl font-black text-brand-accent uppercase italic">
            <span>Total Due</span>
            <span>${cart.totalPrice?.toFixed(2)}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}