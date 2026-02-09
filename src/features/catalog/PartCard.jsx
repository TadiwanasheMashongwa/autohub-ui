import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Star, MapPin, Plus, Minus } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

export default function PartCard({ part }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'CLERK';
  const inStock = part.stockQuantity > 0;
  const isLowStock = inStock && part.stockQuantity <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addItem(part.id, qty);
    setQty(1); 
  };

  const adjustQty = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setQty(prev => Math.max(1, prev + delta));
  };

  return (
    <Link to={`/warehouse/parts/${part.id}`} className="group block bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:bg-slate-900/80 hover:border-brand-accent/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      
      {/* Internal Picking Badge: ONLY FOR STAFF */}
      {isStaff && part.binLocation && (
        <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark px-4 py-1 rounded-bl-2xl text-[9px] font-black uppercase flex items-center gap-1.5 z-10">
          <MapPin className="h-3 w-3" /> {part.binLocation}
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-white">{part.averageRating?.toFixed(1) || "5.0"}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
          !inStock ? 'bg-red-500/10 text-red-500' : isLowStock ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {!inStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
        </div>
      </div>

      {/* Visual & Info Area */}
      <div className="h-48 bg-black/40 rounded-3xl mb-6 flex items-center justify-center overflow-hidden">
        <img 
          src={getImageUrl(part.imageUrl)} 
          className="h-36 w-36 object-contain group-hover:scale-110 transition-all" 
          alt={part.name} 
          onError={(e) => { e.target.src = '/placeholder-part.png'; }}
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span className="text-brand-accent font-black">{part.brand}</span>
          {isStaff && (
            <>
              <span className="h-1 w-1 bg-slate-800 rounded-full" />
              <span className="truncate">SKU: {part.sku}</span>
            </>
          )}
        </div>
        <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-tight group-hover:text-brand-accent transition-colors line-clamp-2">
          {part.name}
        </h3>
      </div>

      {/* CHECKLIST STEP 3: Multiple Quantity & Add to Cart */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1 italic">Price</span>
          <span className="text-3xl font-black text-white tracking-tighter">${part.price.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quantity Toggle */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
            <button onClick={(e) => adjustQty(e, -1)} className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-white w-5 text-center">{qty}</span>
            <button onClick={(e) => adjustQty(e, 1)} className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!inStock}
            className="h-14 w-14 bg-brand-accent text-brand-dark rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale transition-all shadow-2xl"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </Link>
  );
}