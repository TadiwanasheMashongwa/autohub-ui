import { useState } from 'react';
import { useParts, useCategories } from '../../hooks/useParts';
import { useCart } from '../../context/CartContext';
import { Search, Package, ShoppingCart, Loader2 } from 'lucide-react';

export default function PartCatalog() {
  const [filters, setFilters] = useState({ search: '', category: '' });
  const { data: parts, isLoading, isError } = useParts(filters);
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (partId) => {
    setAddingId(partId);
    await addItem(partId, 1);
    setAddingId(null);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Syncing Warehouse Data...</p>
      </div>
    </div>
  );

  if (isError) return <div className="p-10 text-red-500 font-mono">Critical: Inventory Sync Failed</div>;

  return (
    <div className="flex flex-col gap-6 p-6 bg-brand-dark min-h-screen">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Spare Parts <span className="text-brand-accent">Catalog</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono">Terminal Active • System v14.0</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search SKU or Name..."
              className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <select 
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none cursor-pointer"
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {parts?.content?.map((part) => (
          <div key={part.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-brand-accent/30 transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-accent/10 rounded-lg">
                <Package className="h-6 w-6 text-brand-accent" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                part.stockQuantity > 5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {part.stockQuantity} Units
              </span>
            </div>
            
            <h3 className="text-white font-bold text-sm mb-1 truncate">{part.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase tracking-widest">{part.sku}</p>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
              <span className="text-lg font-black text-white">${part.price.toFixed(2)}</span>
              <button 
                onClick={() => handleAddToCart(part.id)}
                disabled={addingId === part.id || part.stockQuantity === 0}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-brand-dark px-4 py-2 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-all active:scale-95"
              >
                {addingId === part.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3" />
                    Reserve
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}