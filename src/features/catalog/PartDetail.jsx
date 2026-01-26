import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { partsApi } from '../../api/partsApi';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../../context/CartContext'; // NEW
import { 
  ChevronLeft, ShoppingCart, ShieldCheck, 
  Weight, Maximize, Settings, Box, 
  Star, Loader2, MapPin,
  MessageSquare, User, Plus, Minus
} from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart(); // NEW
  
  const isStaff = user?.role === 'ADMIN' || user?.role === 'CLERK';
  
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // NEW

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await partsApi.getPartDetails(id);
        setPart(data);
      } catch (error) {
        toast.show("Asset Retrieval Failed: Sector Unreachable", "error");
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
      {/* Navigation */}
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
                Factory Sealed
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
              {isStaff && (
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  Internal ID: <span className="text-slate-300">{part.id}</span>
                </span>
              )}
            </div>
          </header>

          {/* CHECKLIST STEP 3: Fulfillment Terminal with Quantity Selector */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 mb-12 shadow-2xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1 italic">MSRP (USD)</span>
                <span className="text-5xl font-black text-white tracking-tighter leading-none">
                  ${part.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                !inStock ? 'bg-red-500/10 text-red-500' : isLowStock ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {!inStock ? 'Out of Stock' : (isStaff || isLowStock) ? `${part.stockQuantity} Units Available` : 'In Stock'}
              </div>
            </div>

            <div className="flex gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-lg font-mono font-bold text-white w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <button 
                onClick={() => addItem(part.id, quantity)}
                disabled={!inStock}
                className="flex-1 bg-brand-accent hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale text-brand-dark h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-accent/20 active:scale-95"
              >
                <ShoppingCart className="h-6 w-6" />
                {isStaff ? 'Allocate Stock' : 'Add to Order'}
              </button>
            </div>
          </div>

          {/* Technical Grid */}
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

              {isStaff && (
                <>
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-emerald-500" />
                    <div>
                      <span className="text-[9px] text-emerald-500 uppercase font-black block tracking-tighter">Bin Location</span>
                      <span className="text-sm text-white font-bold uppercase">{part.binLocation || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div className="bg-blue-950/20 border border-blue-500/20 p-5 rounded-2xl flex items-center gap-4">
                    <Box className="h-6 w-6 text-blue-500" />
                    <div>
                      <span className="text-[9px] text-blue-500 uppercase font-black block tracking-tighter">OEM & SKU</span>
                      <span className="text-sm text-white font-bold uppercase truncate">{part.sku}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-20 border-t border-white/5 pt-16">
        <div className="flex items-center gap-3 mb-12">
          <MessageSquare className="h-5 w-5 text-brand-accent" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Customer <span className="text-brand-accent not-italic">Feedback</span>
          </h2>
          <span className="ml-4 bg-white/5 text-slate-500 px-3 py-1 rounded-lg font-mono text-xs uppercase tracking-widest">
            {part.reviews?.length || 0} Reports
          </span>
        </div>

        {part.reviews && part.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {part.reviews.map((review) => (
              <div key={review.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">Verified Operator</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">Sector ID: {review.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-800'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic font-medium">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-12 text-center">
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">No field reports available for this asset.</p>
          </div>
        )}
      </section>
    </div>
  );
}