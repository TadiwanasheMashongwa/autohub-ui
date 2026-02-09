import { useState, useEffect } from 'react';
import { vehiclesApi } from '../../api/vehiclesApi';
import { useAuth } from '../auth/AuthContext';
import { Car, ChevronRight, RotateCcw, CheckCircle2, Settings } from 'lucide-react';

export default function VehicleSelector({ onVehicleSelect, selectedVehicle }) {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'CLERK';

  const [step, setStep] = useState('MAKE'); // MAKE -> MODEL -> YEAR
  const [options, setOptions] = useState([]);
  const [selection, setSelection] = useState({ make: '', model: '', yearRange: '' });
  const [loading, setLoading] = useState(false);

  // 🛠️ CRITICAL FIX: Sync Internal State with Parent Prop
  // If the parent (PartCatalog) clears the vehicle (e.g. user clicked a Category),
  // we must reset the internal wizard state back to 'MAKE'.
  useEffect(() => {
    if (!selectedVehicle) {
      setSelection({ make: '', model: '', yearRange: '' });
      setStep('MAKE');
      // Re-fetch makes to ensure the list is ready
      setLoading(true);
      vehiclesApi.getMakes()
        .then(setOptions)
        .catch(() => console.error("Vehicle API Sync Failed"))
        .finally(() => setLoading(false));
    }
  }, [selectedVehicle]);

  // Initial Load
  useEffect(() => {
    if (step === 'MAKE' && !selectedVehicle) {
      setLoading(true);
      vehiclesApi.getMakes()
        .then(setOptions)
        .catch(() => console.error("Vehicle API Sync Failed"))
        .finally(() => setLoading(false));
    }
  }, [step, selectedVehicle]);

  const handleMakeSelect = async (make) => {
    setSelection({ ...selection, make });
    setLoading(true);
    try {
      const models = await vehiclesApi.getModels(make);
      setOptions(models);
      setStep('MODEL');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = async (model) => {
    setSelection({ ...selection, model });
    setLoading(true);
    try {
      const years = await vehiclesApi.getYearRanges(selection.make, model);
      setOptions(years);
      setStep('YEAR');
    } finally {
      setLoading(false);
    }
  };

  const handleYearSelect = async (yearRange) => {
    setLoading(true);
    try {
      const allVehicles = await vehiclesApi.getAll();
      const match = allVehicles.find(v => 
        v.make === selection.make && 
        v.model === selection.model && 
        v.yearRange === yearRange
      );
      
      if (match) {
        onVehicleSelect(match);
        setStep('COMPLETE');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelection({ make: '', model: '', yearRange: '' });
    setStep('MAKE');
    onVehicleSelect(null);
  };

  if (selectedVehicle) {
    return (
      <div className={`border rounded-3xl p-5 flex items-center justify-between animate-in fade-in zoom-in-95 transition-all ${
        isStaff ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-brand-accent/10 border-brand-accent/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isStaff ? 'bg-emerald-500 text-brand-dark' : 'bg-brand-accent text-brand-dark'
          }`}>
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black ${
              isStaff ? 'text-emerald-500' : 'text-brand-accent'
            }`}>
              {isStaff ? 'Terminal Compatibility Locked' : 'Fitment Active'}
            </p>
            <h4 className="text-white font-black uppercase text-base tracking-tight">
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.yearRange})
            </h4>
            {isStaff && selectedVehicle.engineCode && (
              <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5">
                Engine: {selectedVehicle.engineCode}
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={reset} 
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 mb-10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
            {isStaff ? <Settings className="h-5 w-5 text-brand-accent" /> : <Car className="h-5 w-5 text-brand-accent" />}
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm tracking-widest">
              {isStaff ? 'Compatibility Terminal' : 'Identify Your Vehicle'}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
              {isStaff ? 'Database Drill-down for Technical Fitment' : 'Ensure parts match your specific car'}
            </p>
          </div>
        </div>
        {loading && <span className="text-[10px] text-brand-accent animate-pulse font-mono font-black tracking-widest">POLLING...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              if (step === 'MAKE') handleMakeSelect(option);
              else if (step === 'MODEL') handleModelSelect(option);
              else if (step === 'YEAR') handleYearSelect(option);
            }}
            className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-brand-accent/40 hover:bg-brand-accent/5 transition-all group active:scale-95"
          >
            <span className="text-xs font-black text-slate-400 group-hover:text-white uppercase tracking-tight transition-colors">
              {option}
            </span>
            <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3">
        {['MAKE', 'MODEL', 'YEAR'].map((s) => (
          <div 
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              (step === s || (step === 'MODEL' && s === 'MAKE') || (step === 'YEAR' && (s === 'MAKE' || s === 'MODEL')))
              ? 'bg-brand-accent shadow-[0_0_10px_rgba(45,212,191,0.3)]' 
              : 'bg-white/10'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}