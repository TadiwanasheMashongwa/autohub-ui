import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Silicon Valley Celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2dd4bf', '#14b8a6', '#0f766e']
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-brand-accent/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-brand-accent" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Settlement <span className="text-brand-accent">Confirmed</span></h1>
          <p className="text-slate-400 text-sm">Your order has been transmitted to the warehouse for picking and fulfillment.</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Status</p>
            <p className="text-brand-accent font-bold uppercase text-xs">Awaiting Picking</p>
          </div>
          <Printer className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full py-4 bg-white text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            Track in History <Package className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => navigate('/warehouse')}
            className="w-full py-4 bg-transparent text-slate-400 font-bold uppercase tracking-widest rounded-xl hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
          >
            Return to Warehouse <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}