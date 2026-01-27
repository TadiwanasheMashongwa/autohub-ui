import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Wrench 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories'); // Start with Phase 1

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
          System <span className="text-brand-accent italic">Architect</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
          Phase 1: Structural Architecture & Compatibility Matrix
        </p>
      </div>

      {/* Checklist-Aligned Navigation */}
      <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
        <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Category Management" />
        <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicle Matrix" />
      </nav>

      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
    </div>
  );
}

/* ---------------- PHASE 1.1: CATEGORY MANAGEMENT ---------------- */
function CategoryManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  const { data: categories, isLoading } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: adminApi.getCategories 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setIsAdding(false);
      setNewCat({ name: '', description: '' });
      toast.show("Category initialized successfully", "success");
    },
    onError: (err) => toast.show(err.response?.data?.message || "Creation failed", "error")
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.show("Category purged", "success");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Product Departments</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg hover:bg-teal-400 transition-all"
        >
          <Plus size={14}/> New Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Category Name</label>
            <input 
              value={newCat.name}
              onChange={e => setNewCat({...newCat, name: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm"
              placeholder="e.g. Braking Systems"
            />
          </div>
          <div className="flex-[2] space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Description</label>
            <input 
              value={newCat.description}
              onChange={e => setNewCat({...newCat, description: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm"
              placeholder="High-performance pads, discs, and sensors"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400"><X size={20}/></button>
            <button 
              onClick={() => createMutation.mutate(newCat)}
              className="bg-brand-accent p-2 rounded text-brand-dark"><Save size={20}/></button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-300">
            {categories?.map(cat => (
              <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-white font-bold">{cat.name}</td>
                <td className="p-4 opacity-60">{cat.description}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => deleteMutation.mutate(cat.id)}
                    className="text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- PHASE 1.2: VEHICLE COMPATIBILITY ---------------- */
function VehicleManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', yearRange: '', engineCode: '' });

  const { data: vehicles, isLoading } = useQuery({ 
    queryKey: ['vehicles'], 
    queryFn: adminApi.getVehicles 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setIsAdding(false);
      setNewVehicle({ make: '', model: '', yearRange: '', engineCode: '' });
      toast.show("Vehicle profile registered", "success");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Compatibility Matrix</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg"
        >
          <Plus size={14}/> Add Vehicle Profile
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputCol label="Make" val={newVehicle.make} set={v => setNewVehicle({...newVehicle, make: v})} ph="Toyota" />
          <InputCol label="Model" val={newVehicle.model} set={v => setNewVehicle({...newVehicle, model: v})} ph="Hilux" />
          <InputCol label="Year Range" val={newVehicle.yearRange} set={v => setNewVehicle({...newVehicle, yearRange: v})} ph="2015-2023" />
          <InputCol label="Engine Code" val={newVehicle.engineCode} set={v => setNewVehicle({...newVehicle, engineCode: v})} ph="1KD-FTV" />
          <div className="col-span-full flex justify-end gap-3 mt-2">
            <button onClick={() => setIsAdding(false)} className="text-slate-400 uppercase text-[10px] font-bold">Cancel</button>
            <button 
              onClick={() => createMutation.mutate(newVehicle)}
              className="bg-brand-accent text-brand-dark px-6 py-2 rounded font-black uppercase text-[10px]">Save Profile</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map(v => (
          <div key={v.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group">
            <div>
              <p className="text-white font-bold">{v.make} {v.model}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase">{v.yearRange} • {v.engineCode}</p>
            </div>
            <button className="text-slate-600 group-hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>
      {icon} {label}
    </button>
  );
}

function InputCol({ label, val, set, ph }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 uppercase font-bold">{label}</label>
      <input 
        value={val} 
        onChange={e => set(e.target.value)} 
        className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-xs outline-none focus:border-brand-accent"
        placeholder={ph}
      />
    </div>
  );
}