import { ShoppingCart, Star, Box, ShieldCheck, Zap } from 'lucide-react';

export default function PartCard({ part }) {
  const inStock = part.stockQuantity > 0;
  const isLowStock = inStock && part.stockQuantity <= 5;

  return (
    <div className="group bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 hover:bg-slate-900/80 hover:border-brand-accent/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      
      {/* 1. Header Badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-white">{part.averageRating.toFixed(1)}</span>
        </div>
        
        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
          !inStock ? 'bg-red-500/10 text-red-500' : isLowStock ? 'bg-orange-500/10 text-orange-400' : 'bg-brand-accent/10 text-brand-accent'
        }`}>
          {!inStock ? 'Depleted' : isLowStock ? `Low Stock: ${part.stockQuantity}` : 'In Stock'}
        </div>
      </div>

      {/* 2. Media Area */}
      <div className="h-44 bg-black/40 rounded-2xl mb-5 flex items-center justify-center relative group-hover:bg-black/60 transition-colors overflow-hidden">
        <img 
          src={part.imageUrl || '/placeholder-part.png'} 
          alt={part.name}
          className="h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-700"
        />
        {part.condition === 'NEW' && (
          <div className="absolute bottom-2 left-2 bg-brand-accent text-brand-dark px-2 py-0.5 rounded text-[8px] font-black uppercase italic">Factory New</div>
        )}
      </div>

      {/* 3. Info Area */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>{part.brand}</span>
          <span className="h-1 w-1 bg-slate-700 rounded-full" />
          <span className="truncate">{part.sku}</span>
        </div>
        
        <h3 className="text-white font-black text-lg uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-brand-accent transition-colors">
          {part.name}
        </h3>
        
        <p className="text-xs text-slate-400 line-clamp-2 font-medium">
          {part.description || 'Precision-engineered automotive component meeting OEM standards.'}
        </p>
      </div>

      {/* 4. Footer & Action */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-0.5">Price (USD)</span>
          <div className="text-2xl font-black text-white tracking-tighter">
            ${part.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <button
          disabled={!inStock}
          className="h-12 w-12 bg-brand-accent text-brand-dark rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale transition-all shadow-xl shadow-brand-accent/10 group-hover:shadow-brand-accent/20"
        >
          <ShoppingCart className="h-5 w-5 fill-brand-dark/20" />
        </button>
      </div>
    </div>
  );
}