import { useState, useEffect } from 'react';
import { vehiclesApi } from '../../api/vehiclesApi';
import { Car, ChevronRight, RotateCcw, CheckCircle2, Search } from 'lucide-react';

export default function VehicleSelector({ onVehicleSelect, selectedVehicle }) {
  const [step, setStep] = useState('MAKE'); // MAKE -> MODEL -> YEAR
  const [options, setOptions] = useState([]);
  const [selection, setSelection] = useState({ make: '', model: '', yearRange: '' });
  const [loading, setLoading] = useState(false);

  // Step 1: Load Makes on mount
  useEffect(() => {
    if (step === 'MAKE') {
      setLoading(true);
      vehiclesApi.getMakes().then(setOptions).finally(() => setLoading(false));
    }
  }, [step]);

  const handleMakeSelect = async (make) => {
    setSelection({ ...selection, make });
    setLoading(true);
    const models = await vehiclesApi.getModels(make);
    setOptions(models);
    setStep('MODEL');
    setLoading(false);
  };

  const handleModelSelect = async (model) => {
    setSelection({ ...selection, model });
    setLoading(true);
    const years = await vehiclesApi.getYearRanges(selection.make, model);
    setOptions(years);
    setStep('YEAR');
    setLoading(false);
  };

  const handleYearSelect = async (yearRange) => {
    setLoading(true);
    // Find the specific vehicle ID from the full list to pass to the parts API
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
    setLoading(false);
  };

  const reset = () => {
    setSelection({ make: '', model: '', yearRange: '' });
    setStep('MAKE');
    onVehicleSelect(null);
  };

  if (selectedVehicle) {
    return (
      <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-3xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-brand-accent rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-brand-dark" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">Fitment Active</p>
            <h4 className="text-white font-black uppercase text-sm">
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.yearRange})
            </h4>
          </div>
        </div>
        <button onClick={reset} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Car className="h-5 w-5 text-brand-accent" />
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Identify Your Vehicle</h3>
        {loading && <span className="text-[10px] text-brand-accent animate-pulse font-mono">LINKING...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              if (step === 'MAKE') handleMakeSelect(option);
              else if (step === 'MODEL') handleModelSelect(option);
              else if (step === 'YEAR') handleYearSelect(option);
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all group"
          >
            <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase">{option}</span>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-brand-accent" />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className={`h-1 flex-1 rounded-full ${step === 'MAKE' ? 'bg-brand-accent' : 'bg-white/10'}`} />
        <span className={`h-1 flex-1 rounded-full ${step === 'MODEL' ? 'bg-brand-accent' : 'bg-white/10'}`} />
        <span className={`h-1 flex-1 rounded-full ${step === 'YEAR' ? 'bg-brand-accent' : 'bg-white/10'}`} />
      </div>
    </div>
  );
}