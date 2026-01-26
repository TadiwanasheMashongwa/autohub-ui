import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';

export default function CartDrawer() {
  const { cart, removeItem, isDrawerOpen, setIsDrawerOpen } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-dark border-l border-white/10 shadow-2xl">
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-brand-accent" />
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Current Order</h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart?.items?.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex-1">
                      {/* FIX: Nested Part Access */}
                      <h4 className="text-white font-bold text-sm truncate">{item.part.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase">Qty: {item.quantity}</p>
                      <p className="text-brand-accent font-bold mt-1">${item.part.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-600 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 italic">
                  <ShoppingBag className="h-12 w-12 mb-4" />
                  <p>Cart is currently empty</p>
                </div>
              )}
            </div>

            {cart?.items?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-slate-400 font-mono text-sm uppercase">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-black text-xl tracking-tighter uppercase">
                  <span>Total</span>
                  <span className="text-brand-accent">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all">
                  <CreditCard className="h-5 w-5" /> Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}