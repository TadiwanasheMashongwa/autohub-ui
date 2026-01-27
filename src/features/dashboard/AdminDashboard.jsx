import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings, Search, Users, Download, TrendingUp, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen text-white">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            System <span className="text-brand-accent italic">Architect</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Terminal Level: Root Authority</p>
        </div>

        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Catalog" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={14}/>} label="Customers" />
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Settings size={14}/>} label="Staff/Stats" />
        </nav>
      </div>

      {/* DYNAMIC CONTENT TABBING */}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'customers' && <CustomerDirectory />}
      {activeTab === 'ops' && <OperationsSection />}
    </div>
  );
}

// --- 1. CATEGORY MANAGER ---
function CategoryManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  const { data: categories, isLoading } = useQuery({ 
    queryKey: ['categories', searchTerm], 
    queryFn: () => adminApi.getCategories(searchTerm),
    placeholderData: (prev) => prev
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => { queryClient.invalidateQueries(['categories']); setIsAdding(false); setNewCat({name:'', description:''}); toast.show("Category created", "success"); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateCategory(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); setEditingId(null); toast.show("Updated", "success"); }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.show("Purged", "success"); }
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input type="text" placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm outline-none focus:border-brand-accent transition-all" />
        </div>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg"><Plus size={14}/> New Category</button>}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end animate-in slide-in-from-top-2">
          <div className="flex-1 space-y-2"><label className="text-[10px] text-slate-500 uppercase font-bold">Name</label><input value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm" /></div>
          <div className="flex-[2] space-y-2"><label className="text-[10px] text-slate-500 uppercase font-bold">Description</label><input value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white text-sm" /></div>
          <div className="flex gap-2"><button onClick={() => setIsAdding(false)} className="p-2 text-slate-400"><X size={20}/></button><button onClick={() => createMutation.mutate(newCat)} className="bg-brand-accent p-2 rounded text-brand-dark"><Save size={20}/></button></div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr><th className="p-4">Name</th><th className="p-4">Description</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="text-xs text-slate-300">
            {categories?.map(cat => (
              <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4 font-bold">{editingId === cat.id ? <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-slate-900 border border-brand-accent/30 p-1 rounded text-white" /> : <span className="text-white">{cat.name}</span>}</td>
                <td className="p-4">{editingId === cat.id ? <input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="bg-slate-900 border border-brand-accent/30 p-1 rounded text-white w-full" /> : <span className="opacity-60">{cat.description}</span>}</td>
                <td className="p-4 text-right space-x-4">
                  {editingId === cat.id ? <><button onClick={() => updateMutation.mutate({id: cat.id, data: editForm})} className="text-brand-accent"><Save size={16}/></button><button onClick={() => setEditingId(null)} className="text-slate-500"><X size={16}/></button></> :
                  <><button onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, description: cat.description }); }} className="text-slate-400 hover:text-brand-accent"><Edit3 size={16}/></button><button onClick={() => { if(window.confirm('Delete category?')) deleteMutation.mutate(cat.id); }} className="text-red-400/30 hover:text-red-400"><Trash2 size={16}/></button></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 2. VEHICLE MANAGER ---
function VehicleManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', yearRange: '', engineCode: '' });

  const { data: vehicles, isLoading } = useQuery({ queryKey: ['vehicles'], queryFn: adminApi.getVehicles });

  const filteredVehicles = vehicles?.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: adminApi.createVehicle,
    onSuccess: () => { queryClient.invalidateQueries(['vehicles']); setIsAdding(false); setNewVehicle({make:'', model:'', yearRange:'', engineCode:''}); toast.show("Matrix expanded", "success"); }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="text" placeholder="Search Matrix..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm outline-none focus:border-brand-accent" /></div>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg"><Plus size={14}/> Matrix Expansion</button>}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><InputGroup label="Manufacturer" val={newVehicle.make} set={v => setNewVehicle({...newVehicle, make: v})} ph="Toyota" /><InputGroup label="Model" val={newVehicle.model} set={v => setNewVehicle({...newVehicle, model: v})} ph="Hilux" /><InputGroup label="Years" val={newVehicle.yearRange} set={v => setNewVehicle({...newVehicle, yearRange: v})} ph="2015-2022" /><InputGroup label="Engine" val={newVehicle.engineCode} set={v => setNewVehicle({...newVehicle, engineCode: v})} ph="1KD-FTV" /></div>
          <div className="flex justify-end gap-4 mt-6"><button onClick={() => setIsAdding(false)} className="text-slate-500 uppercase text-[10px] font-black">Abort</button><button onClick={() => createMutation.mutate(newVehicle)} className="bg-brand-accent text-brand-dark px-8 py-2 rounded-lg font-black uppercase text-[10px]">Commit</button></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles?.map(v => (
          <div key={v.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center group">
            <div>
              <p className="text-white font-black uppercase tracking-tight text-sm">{v.make} <span className="text-brand-accent italic">{v.model}</span></p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">{v.yearRange} • {v.engineCode}</p>
            </div>
            <button onClick={() => { if(window.confirm('Delete vehicle?')) adminApi.deleteVehicle(v.id).then(() => queryClient.invalidateQueries(['vehicles'])); }} className="text-slate-700 group-hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. CUSTOMER DIRECTORY (FINANCIAL INTELLIGENCE) ---
function CustomerDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: customers, isLoading } = useQuery({ queryKey: ['customers'], queryFn: adminApi.getCustomers });

  const filteredCustomers = customers?.filter(c => 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    if (!filteredCustomers?.length) return;
    const headers = "ID,Customer,Email,Business,Orders,Total Spent,Last Activity\n";
    const rows = filteredCustomers.map(c => 
      `${c.id},"${c.firstName} ${c.lastName}","${c.email}","${c.businessName || 'Individual'}",${c.orderCount || 0},${c.totalSpent || 0},"${c.lastOrderDate || 'N/A'}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AutoHub_Financials_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.show("Financial CSV Exported", "success");
  };

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full md:w-96"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="text" placeholder="Search analytics..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm outline-none focus:border-brand-accent" /></div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase rounded-lg hover:bg-white/10"><Download size={14} className="text-brand-accent"/> Export CSV</button>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr><th className="p-4">Customer</th><th className="p-4 text-center">Orders</th><th className="p-4">Revenue (LTV)</th><th className="p-4">Last Activity</th></tr>
          </thead>
          <tbody className="text-slate-300">
            {filteredCustomers?.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4"><p className="text-white font-bold">{c.firstName} {c.lastName}</p><p className="text-[10px] text-slate-500">{c.email}</p></td>
                <td className="p-4 text-center"><span className="bg-white/5 px-2 py-1 rounded-full text-[10px] font-mono">{c.orderCount || 0}</span></td>
                <td className="p-4 font-black text-brand-accent tracking-tighter">${Number(c.totalSpent || 0).toFixed(2)}</td>
                <td className="p-4 opacity-60">{c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 4. STAFF & STATS ---
function OperationsSection() {
  const queryClient = useQueryClient();
  const [clerkSearch, setClerkSearch] = useState('');
  const [clerk, setClerk] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });
  const { data: clerks } = useQuery({ queryKey: ['clerks', clerkSearch], queryFn: () => adminApi.getClerks(clerkSearch) });

  const clerkMutation = useMutation({
    mutationFn: adminApi.createClerk,
    onSuccess: () => { queryClient.invalidateQueries(['clerks']); toast.show("Clerk initialized", "success"); setClerk({email:'', password:'', firstName:'', lastName:''}); }
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} />
        <MetricCard title="Total Orders" value={stats?.totalOrders || 0} />
        <MetricCard title="Low Stock" value={stats?.lowStockCount || 0} />
        <MetricCard title="Customers" value={stats?.totalCustomers || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6">Staff Provisioning</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); clerkMutation.mutate(clerk); }}>
            <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="First Name" value={clerk.firstName} onChange={e => setClerk({...clerk, firstName: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded text-xs text-white" required /><input type="text" placeholder="Last Name" value={clerk.lastName} onChange={e => setClerk({...clerk, lastName: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded text-xs text-white" required /></div>
            <input type="email" placeholder="Work Email" value={clerk.email} onChange={e => setClerk({...clerk, email: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-3 rounded text-xs text-white" required />
            <input type="password" placeholder="Temporary Password" value={clerk.password} onChange={e => setClerk({...clerk, password: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-3 rounded text-xs text-white" required />
            <button className="w-full py-4 bg-brand-accent text-brand-dark font-black uppercase text-xs rounded-xl hover:bg-teal-400">Initialize Operator</button>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4">Internal Registry</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {clerks?.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg">
                <div><p className="text-xs font-bold">{c.firstName} {c.lastName}</p><p className="text-[10px] text-slate-500">{c.email}</p></div>
                <button onClick={() => { if(window.confirm('Revoke access?')) adminApi.deleteClerk(c.id).then(() => queryClient.invalidateQueries(['clerks'])); }} className="text-red-500/50 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SHARED UI HELPERS ---
function TabBtn({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>{icon} {label}</button>;
}

function InputGroup({ label, val, set, ph }) {
  return <div className="space-y-2"><label className="text-[10px] text-slate-500 uppercase font-black">{label}</label><input value={val} onChange={e => set(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-brand-accent" placeholder={ph} /></div>;
}

function MetricCard({ title, value }) {
  return <div className="bg-white/5 border border-white/10 p-6 rounded-2xl"><p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p><p className="text-2xl font-black text-white mt-1">{value}</p></div>;
}