import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { partsApi } from '../../api/partsApi';
import { 
  ChevronLeft, ShoppingCart, ShieldCheck, 
  Weight, Maximize, Settings, Box, 
  Star, Truck, AlertCircle, Loader2 
} from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await partsApi.getPartDetails(id);
        setPart(data);
      } catch (error) {
        toast.show("Inventory Link Severed: Sector Unreachable", "error");
        navigate('/warehouse');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-brand-dark">
      <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
      <span className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em]">Synchronizing Tech Specs...</span>
    </div>
  );

  const inStock = part.stockQuantity > 0;
  const isLowStock = inStock && part.stockQuantity <= 5;

  return (
    <div className="min-h-screen bg-brand-dark p-8 max-w-7xl mx-auto">
      {/* Navigation Circuit */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <Link to="/warehouse" className="hover:text-brand-accent transition-colors">Warehouse</Link>
          <span>/</span>
          <span className="text-white">{part.category?.name || 'Inventory'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Visual Sector */}
        <div className="space-y-6">
          <div className="aspect-square bg-black/40 border border-white/5 rounded-[3.5rem] flex items-center justify-center overflow-hidden relative group">
            <img 
              src={part.imageUrl || '/placeholder-part.png'} 
              alt={part.name}
              className="w-3/4 object-contain group-hover:scale-105 transition-transform duration-700"
            />
            {part.condition === 'NEW' && (
              <div className="absolute top-10 left-10 bg-brand-accent text-brand-dark px-5 py-1.5 rounded-xl text-xs font-black uppercase italic shadow-2xl">
                Factory Certified
              </div>
            )}
          </div>
        </div>

        {/* Data Sector */}
        <div className="flex flex-col">
          <header className="mb-8">
            <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">
              {part.brand} Manufacturing
            </span>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
              {part.name}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-black text-white">{part.averageRating?.toFixed(1) || '5.0'}</span>
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                Identifier: <span className="text-slate-300">{part.sku}</span>
              </span>
            </div>
          </header>

          {/* Fulfillment Terminal */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 mb-12 shadow-2xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1 italic">Unit Value (USD)</span>
                <span className="text-5xl font-black text-white tracking-tighter leading-none">
                  ${part.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                !inStock ? 'bg-red-500/10 text-red-500' : isLowStock ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {!inStock ? 'Supply Exhausted' : isLowStock ? `Low Stock: ${part.stockQuantity}` : 'Operational'}
              </div>
            </div>

            <button 
              disabled={!inStock}
              className="w-full bg-brand-accent hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale text-brand-dark h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-accent/20 active:scale-95"
            >
              <ShoppingCart className="h-6 w-6" />
              Initialize Order
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                <Truck className="h-4 w-4 text-brand-accent" /> Logistics Global
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                <ShieldCheck className="h-4 w-4 text-brand-accent" /> OEM Authenticity
              </div>
            </div>
          </div>

          {/* Technical Specifications (Direct Mapping from Part.java) */}
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
              <Settings className="h-4 w-4 text-brand-accent" /> 
              Engineering Specifications
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <Weight className="h-6 w-6 text-slate-600" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-tighter">Gross Weight</span>
                  <span className="text-sm text-white font-bold">{part.weight || '0.00'} kg</span>
                </div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <Maximize className="h-6 w-6 text-slate-600" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-tighter">Dimensions</span>
                  <span className="text-sm text-white font-bold uppercase">{part.dimensions || 'Standard'}</span>
                </div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <Box className="h-6 w-6 text-slate-600" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-tighter">OEM Number</span>
                  <span className="text-sm text-white font-bold uppercase truncate">{part.oemNumber || 'Proprietary'}</span>
                </div>
              </div>
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <AlertCircle className="h-6 w-6 text-slate-600" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-tighter">Bin Location</span>
                  <span className="text-sm text-white font-bold uppercase">{part.binLocation || 'Automated'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Functional Summary */}
          <section className="mt-12 pt-10 border-t border-white/5">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4">Functional Summary</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              {part.description || "Precision-engineered component optimized for high-performance automotive applications. Meets all factory clearance and durability standards."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}