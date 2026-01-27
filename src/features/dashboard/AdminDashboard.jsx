import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings, Search 
} from 'lucide-react';

// SILICON VALLEY GRADE: Default Export Wrapper for App.jsx
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

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
    }
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

/* ---------------- PHASE 1.2: VEHICLE COMPATIBILITY (SEARCH & CRUD) ---------------- */
function VehicleManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', yearRange: '', engineCode: '' });

  const { data: vehicles, isLoading } = useQuery({ 
    queryKey: ['vehicles'], 
    queryFn: adminApi.getVehicles 
  });

  const filteredVehicles = vehicles?.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.engineCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: adminApi.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setIsAdding(false);
      setNewVehicle({ make: '', model: '', yearRange: '', engineCode: '' });
      toast.show("Vehicle profile registered", "success");
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search Matrix (Make, Model...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm outline-none focus:border-brand-accent transition-all"
          />
        </div>

        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg">
            <Plus size={14}/> Matrix Expansion
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputGroup label="Manufacturer" val={newVehicle.make} set={v => setNewVehicle({...newVehicle, make: v})} ph="Toyota" />
            <InputGroup label="Model" val={newVehicle.model} set={v => setNewVehicle({...newVehicle, model: v})} ph="Hilux" />
            <InputGroup label="Year Range" val={newVehicle.yearRange} set={v => setNewVehicle({...newVehicle, yearRange: v})} ph="2015-2022" />
            <InputGroup label="Engine" val={newVehicle.engineCode} set={v => setNewVehicle({...newVehicle, engineCode: v})} ph="1KD-FTV" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 uppercase text-[10px] font-black tracking-widest">Abort</button>
            <button onClick={() => createMutation.mutate(newVehicle)} className="bg-brand-accent text-brand-dark px-8 py-2 rounded-lg font-black uppercase text-[10px]">Commit</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles?.map(v => (
          <div key={v.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center group">
            <div>
              <p className="text-white font-black uppercase tracking-tight text-sm">{v.make} <span className="text-brand-accent italic">{v.model}</span></p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">{v.yearRange} • {v.engineCode}</p>
            </div>
            <button onClick={() => deleteMutation.mutate(v.id)} className="text-slate-700 group-hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PHASE 3/5: OPS & STAFF ---------------- */
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

/* ---------------- SHARED COMPONENTS ---------------- */
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>
      {icon} {label}
    </button>
  );
}

function InputGroup({ label, val, set, ph }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-slate-500 uppercase font-black">{label}</label>
      <input value={val} onChange={e => set(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-brand-accent" placeholder={ph} />
    </div>
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