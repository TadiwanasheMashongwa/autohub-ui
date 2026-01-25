import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { Filter, Tag, Award, ShieldCheck, RotateCcw } from 'lucide-react';

export default function PartFilters({ activeFilters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const brands = ['Bosch', 'Brembo', 'Denso', 'NGK', 'Mobil 1', 'Castrol'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to sync categories");
      }
    };
    fetchCategories();
  }, []);

  const clearFilters = () => {
    onFilterChange({ categoryId: null, brand: null, condition: null });
  };

  return (
    // SV-Grade: Locked width and flex-shrink-0 ensures this sidebar NEVER disappears
    <aside className="w-72 flex-shrink-0 border-r border-white/5 bg-slate-950/20 p-8 flex flex-col gap-10 sticky top-0 h-screen overflow-y-auto z-20">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3">
          <Filter className="h-4 w-4 text-brand-accent" />
          Refine
        </h3>
        <button onClick={clearFilters} className="text-slate-600 hover:text-red-400 transition-colors">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-12">
        {/* Category Section */}
        <section>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Categories</label>
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ ...activeFilters, categoryId: activeFilters.categoryId === cat.id ? null : cat.id })}
                className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  activeFilters.categoryId === cat.id 
                  ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Brand Section */}
        <section>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Manufacturer</label>
          <div className="grid grid-cols-1 gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => onFilterChange({ ...activeFilters, brand: activeFilters.brand === brand ? null : brand })}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${
                  activeFilters.brand === brand 
                  ? 'bg-brand-accent border-brand-accent text-brand-dark' 
                  : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'
                }`}
              >
                <Award className="h-4 w-4" />
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* Condition Section */}
        <section>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Condition</label>
          <div className="space-y-3">
            {['NEW', 'USED', 'REFURBISHED'].map(cond => (
              <label key={cond} className="flex items-center gap-4 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={activeFilters.condition === cond}
                  onChange={() => onFilterChange({ ...activeFilters, condition: activeFilters.condition === cond ? null : cond })}
                />
                <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                  activeFilters.condition === cond ? 'bg-brand-accent border-brand-accent' : 'border-white/10 group-hover:border-white/30'
                }`}>
                  {activeFilters.condition === cond && <ShieldCheck className="h-3.5 w-3.5 text-brand-dark" />}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${activeFilters.condition === cond ? 'text-white' : 'text-slate-500'}`}>{cond}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}