import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories'); // Checklist Phase 1 Priority

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            System <span className="text-brand-accent italic">Architect</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Phase 1: Structural Architecture & Compatibility
          </p>
        </div>

        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Categories" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicle Matrix" />
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Settings size={14}/>} label="Staff/Stats" />
        </nav>
      </div>

      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'ops' && <OperationsSection />}
    </div>
  );
}

/* ---------------- PHASE 1.1: CATEGORY MANAGEMENT ---------------- */
function CategoryManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
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
      toast.show("Category created successfully", "success");
    },
    onError: (err) => toast.show(err.response?.data?.message || "Creation error", "error")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setEditingId(null);
      toast.show("Metadata updated", "success");
    }
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
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg">
            <Plus size={14}/> New Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Category Name</label>
            <input value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm" placeholder="e.g. Engine Parts" />
          </div>
          <div className="flex-[2] space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold">Description</label>
            <input value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm" placeholder="Internal components and gaskets" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:text-white"><X size={20}/></button>
            <button onClick={() => createMutation.mutate(newCat)} className="bg-brand-accent p-2 rounded text-brand-dark"><Save size={20}/></button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-300">
            {categories?.map(cat => (
              <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4 font-bold">
                  {editingId === cat.id ? (
                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-slate-900 border border-brand-accent/30 p-1 rounded text-white" />
                  ) : <span className="text-white">{cat.name}</span>}
                </td>
                <td className="p-4">
                  {editingId === cat.id ? (
                    <input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-slate-900 border border-brand-accent/30 p-1 rounded text-white" />
                  ) : <span className="opacity-60">{cat.description}</span>}
                </td>
                <td className="p-4 text-right space-x-4">
                  {editingId === cat.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateMutation.mutate({ id: cat.id, data: editForm })} className="text-brand-accent"><Save size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, description: cat.description }); }} className="text-slate-500 hover:text-brand-accent"><Edit3 size={16}/></button>
                      <button onClick={() => deleteMutation.mutate(cat.id)} className="text-red-400/30 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- PHASE 1.2: VEHICLE MATRIX (Read/Delete) ---------------- */
/* ---------------- PHASE 1.2: VEHICLE COMPATIBILITY (CRUD) ---------------- */
function VehicleManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ 
    make: '', model: '', yearRange: '', engineCode: '' 
  });

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
      toast.show("Vehicle profile registered to matrix", "success");
    },
    onError: (err) => toast.show("Matrix expansion failed: " + (err.response?.data?.message || "Check fields"), "error")
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.show("Vehicle profile removed", "success");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Compatibility Matrix</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg hover:bg-teal-400 transition-all"
          >
            <Plus size={14}/> Matrix Expansion
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputGroup label="Manufacturer (Make)" val={newVehicle.make} set={v => setNewVehicle({...newVehicle, make: v})} ph="e.g. Toyota" />
            <InputGroup label="Vehicle Model" val={newVehicle.model} set={v => setNewVehicle({...newVehicle, model: v})} ph="e.g. Hilux" />
            <InputGroup label="Year Range" val={newVehicle.yearRange} set={v => setNewVehicle({...newVehicle, yearRange: v})} ph="e.g. 2015-2022" />
            <InputGroup label="Engine Code" val={newVehicle.engineCode} set={v => setNewVehicle({...newVehicle, engineCode: v})} ph="e.g. 1KD-FTV" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">Abort</button>
            <button 
              onClick={() => createMutation.mutate(newVehicle)}
              className="bg-brand-accent text-brand-dark px-8 py-2 rounded-lg font-black uppercase text-[10px] tracking-tighter hover:bg-teal-400"
            >
              Commit to Matrix
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map(v => (
          <div key={v.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center group hover:border-white/20 transition-all">
            <div>
              <p className="text-white font-black uppercase tracking-tight text-sm">{v.make} <span className="text-brand-accent italic">{v.model}</span></p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 font-mono uppercase">{v.yearRange}</span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 font-mono uppercase">{v.engineCode}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if(window.confirm(`Purge ${v.make} ${v.model} from matrix?`)) deleteMutation.mutate(v.id)
              }}
              className="text-slate-700 group-hover:text-red-500 transition-colors p-2"
            >
              <Trash2 size={18}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper for the Vehicle Form
function InputGroup({ label, val, set, ph }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{label}</label>
      <input 
        value={val} 
        onChange={e => set(e.target.value)}
        className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-brand-accent transition-colors"
        placeholder={ph}
      />
    </div>
  );
}

/* ---------------- PHASE 3: OPS & STAFF ---------------- */
function OperationsSection() {
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
      <MetricCard title="Gross Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} />
      <MetricCard title="Total Orders" value={stats?.totalOrders || 0} />
      <MetricCard title="Customer Base" value={stats?.totalCustomers || 0} />
      <MetricCard title="Stock Alerts" value={stats?.lowStockCount || 0} />
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>
      {icon} {label}
    </button>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </div>
  );
}