import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft, 
  CreditCard, 
  Package, 
  Loader2 
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, loading } = useCart();

  // 1. Loading State: Prevents layout shift during re-hydration
  if (loading && !cart) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Syncing Local Inventory...</p>
      </div>
    );
  }

  // 2. Empty State Logic: Verified Step 3 of Checklist
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="bg-white/5 p-8 rounded-full border border-white/10">
          <ShoppingBag className="h-16 w-16 text-slate-700" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Inventory Empty</h2>
          <p className="text-slate-500 font-mono text-sm uppercase">Your shopping cart is currently decentralized</p>
        </div>
        <Link 
          to="/warehouse" 
          className="flex items-center gap-2 px-8 py-4 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all"
        >
          <ArrowLeft className="h-5 w-5" /> Return to Warehouse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            Shopping <span className="text-brand-accent">Bag</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
            Reserved Items: {cart.itemCount}
          </p>
        </div>
        {loading && <Loader2 className="h-4 w-4 text-brand-accent animate-spin mb-2" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 group hover:border-brand-accent/20 transition-all ${
                loading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {/* Part Visualizer */}
              <div className="h-24 w-24 bg-black/40 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
                {item.part?.imageUrl ? (
                  <img 
                    src={item.part.imageUrl} 
                    alt={item.part.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <Package className="h-8 w-8 text-slate-700" />
                )}
              </div>

              {/* Identity & Pricing */}
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="text-white font-bold uppercase tracking-tight">
                  {item.part?.name || "Unknown Component"}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  SKU: {item.part?.sku || 'N/A'}
                </p>
                <p className="text-brand-accent font-black text-lg">
                  ${(item.part?.price || 0).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-black/40 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-white font-mono font-bold w-8 text-center">
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Destructive Action */}
              <button 
                onClick={() => removeItem(item.id)}
                className="text-slate-600 hover:text-red-500 transition-colors p-4"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl sticky top-24 space-y-6 backdrop-blur-sm">
            <h3 className="text-white font-black uppercase text-sm tracking-widest border-b border-white/5 pb-4">
              Order Summary
            </h3>
            
            <div className="space-y-4 font-mono text-sm uppercase">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${(cart.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-brand-accent">TBD at Checkout</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="text-slate-500 font-mono text-xs uppercase">Est. Total</span>
              <span className="text-3xl font-black text-white tracking-tighter">
                ${(cart.totalPrice || 0).toFixed(2)}
              </span>
            </div>

            <Link 
              to="/checkout"
              className={`w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CreditCard className="h-5 w-5" /> Final Settlement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}