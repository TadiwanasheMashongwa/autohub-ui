import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, CreditCard, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, removeItem, isDrawerOpen, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleProceed = () => {
    setIsDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsDrawerOpen(false)} 
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-dark border-l border-white/10 shadow-2xl">
          <div className="h-full flex flex-col p-6">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                < ShoppingBag className="h-6 w-6 text-brand-accent" />
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Current Order</h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart?.items?.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 group hover:border-brand-accent/20 transition-all">
                    {/* Visual Identifier */}
                    <div className="h-16 w-16 bg-black/40 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
                      {item.part?.imageUrl ? (
                        <img src={item.part.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-slate-700" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm truncate uppercase tracking-tight">
                        {item.part.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-brand-accent font-bold mt-1">
                        ${item.part.price.toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-600 hover:text-red-500 transition-colors p-2 self-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 italic space-y-4">
                  <ShoppingBag className="h-12 w-12" />
                  <p className="text-center font-mono text-xs uppercase tracking-widest">
                    Your cart is currently<br/>decentralized
                  </p>
                </div>
              )}
            </div>

            {cart?.items?.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-black text-2xl tracking-tighter uppercase">
                  <span>Total Due</span>
                  <span className="text-brand-accent">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleProceed}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-accent/10"
                >
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