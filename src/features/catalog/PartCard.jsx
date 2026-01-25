import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Weight, Maximize } from 'lucide-react';

export default function PartCard({ part }) {
  const inStock = part.stockQuantity > 0;
  const isLowStock = inStock && part.stockQuantity <= 5;

  return (
    <Link to={`/warehouse/parts/${part.id}`} className="group block bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:bg-slate-900/80 hover:border-brand-accent/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-white">{part.averageRating?.toFixed(1) || "5.0"}</span>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
          !inStock ? 'bg-red-500/10 text-red-500' : isLowStock ? 'bg-orange-500/10 text-orange-400' : 'bg-brand-accent/10 text-brand-accent'
        }`}>
          {!inStock ? 'Depleted' : isLowStock ? `Low Stock: ${part.stockQuantity}` : 'Operational'}
        </div>
      </div>

      <div className="h-48 bg-black/40 rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-black/60 transition-colors">
        <img 
          src={part.imageUrl || '/placeholder-part.png'} 
          alt={part.name}
          className="h-36 w-36 object-contain group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span className="text-brand-accent font-black">{part.brand}</span>
          <span className="h-1 w-1 bg-slate-800 rounded-full" />
          <span className="truncate">{part.sku}</span>
        </div>
        <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-tight group-hover:text-brand-accent transition-colors line-clamp-2">
          {part.name}
        </h3>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Weight className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">{part.weight || '0'} kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Maximize className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">{part.dimensions || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1">Unit Price</span>
          <span className="text-3xl font-black text-white tracking-tighter">
            ${part.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button className="h-14 w-14 bg-brand-accent text-brand-dark rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 transition-all shadow-2xl shadow-brand-accent/20">
          <ShoppingCart className="h-6 w-6" />
        </button>
      </div>
    </Link>
  );
}