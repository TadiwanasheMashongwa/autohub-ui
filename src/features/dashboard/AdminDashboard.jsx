import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings, Search, Users, 
  Download, Package, AlertTriangle, Link as LinkIcon, Copy, MessageSquare, Star, ShieldX 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">System <span className="text-brand-accent italic">Architect</span></h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Terminal Level: Root Authority</p>
        </div>
        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={14}/>} label="Inventory" />
          <TabBtn active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare size={14}/>} label="Reviews" />
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Catalog" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={14}/>} label="Customers" />
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Settings size={14}/>} label="Staff/Stats" />
        </nav>
      </div>

      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'reviews' && <ReviewModerator />}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'customers' && <CustomerDirectory />}
      {activeTab === 'ops' && <OperationsSection />}
    </div>
  );
}

// --- PHASE 4: REVIEW MODERATOR (BRAND SENTIMENT) ---
function ReviewModerator() {
  const queryClient = useQueryClient();
  const [negativeOnly, setNegativeOnly] = useState(false);
  
  const { data: reviews, isLoading } = useQuery({ 
    queryKey: ['reviews', negativeOnly], 
    queryFn: () => adminApi.getReviews(negativeOnly) 
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      toast.show("Review purged and ratings recalculated", "success");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto p-20" />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-tighter">Moderation <span className="text-brand-accent italic">Terminal</span></h2>
        <button 
          onClick={() => setNegativeOnly(!negativeOnly)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all border ${negativeOnly ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-slate-400'}`}
        >
          <ShieldX size={14}/> {negativeOnly ? 'Sentiment: Negative Focus' : 'Monitor All Feedback'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reviews?.map(r => (
          <div key={r.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={12} fill={star <= r.rating ? "currentColor" : "none"} className={star <= r.rating ? "" : "opacity-20"} />
                ))}
                <span className="text-[10px] font-mono text-slate-500 ml-3">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <button onClick={() => { if(window.confirm('Delete review permanently?')) deleteMutation.mutate(r.id); }} className="text-slate-700 group-hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            <p className="text-sm text-slate-300 italic">"{r.comment}"</p>
            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black uppercase text-brand-accent">{r.user?.firstName} {r.user?.lastName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{r.user?.email}</p>
              </div>
              <p className="text-[10px] font-black uppercase opacity-60 text-right max-w-[150px] truncate">{r.part?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PHASE 2: INVENTORY ---
function InventoryManager() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [compatPart, setCompatPart] = useState(null);
  const [newPart, setNewPart] = useState({ name: '', sku: '', barcode: '', price: 0, stockQuantity: 0, brand: '', condition: 'NEW' });

  const { data: partsData } = useQuery({ queryKey: ['parts', q], queryFn: () => adminApi.getParts(q) });

  const createMutation = useMutation({
    mutationFn: adminApi.createPart,
    onSuccess: () => { queryClient.invalidateQueries(['parts']); setIsAdding(false); toast.show("Part synchronized", "success"); }
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, qty }) => adminApi.adjustStock(id, qty),
    onSuccess: () => { queryClient.invalidateQueries(['parts']); toast.show("Stock authority updated", "success"); }
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full md:w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500"/><input type="text" placeholder="Search SKU/Name..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm outline-none" /></div>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg"><Plus size={14}/> New Part</button>}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
          <InputGroup label="Name" val={newPart.name} set={v => setNewPart({...newPart, name:v})} ph="Oil Filter" />
          <InputGroup label="SKU" val={newPart.sku} set={v => setNewPart({...newPart, sku:v})} ph="OF-101" />
          <InputGroup label="Barcode" val={newPart.barcode} set={v => setNewPart({...newPart, barcode:v})} ph="77123..." />
          <InputGroup label="Price" val={newPart.price} set={v => setNewPart({...newPart, price:v})} ph="15.00" />
          <div className="flex gap-2 items-end"><button onClick={() => setIsAdding(false)} className="p-3 text-slate-500"><X/></button><button onClick={() => createMutation.mutate(newPart)} className="bg-brand-accent text-brand-dark p-3 rounded-lg w-full"><Save size={20}/></button></div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr><th className="p-4">Detail</th><th className="p-4">SKU/Brand</th><th className="p-4">Inventory</th><th className="p-4 text-right">Gatekeeper</th></tr>
          </thead>
          <tbody className="text-xs">
            {partsData?.content?.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4"><p className="font-bold">{p.name}</p><p className="text-[10px] text-brand-accent uppercase font-black">{p.condition}</p></td>
                <td className="p-4 text-slate-400 font-mono">{p.sku} | {p.brand}</td>
                <td className="p-4 flex items-center gap-3"><span className={p.stockQuantity <= 5 ? 'text-red-500 animate-pulse' : ''}>{p.stockQuantity} units</span> {p.stockQuantity <= 5 && <AlertTriangle size={12}/>}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => setCompatPart(p)} className="text-slate-400 hover:text-brand-accent"><LinkIcon size={16}/></button>
                  <button onClick={() => { const n = window.prompt("Adjust Stock:", p.stockQuantity); if(n) stockMutation.mutate({id:p.id, qty:parseInt(n)}); }} className="text-slate-400 hover:text-white"><Edit3 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compatPart && <CompatibilityModal part={compatPart} onClose={() => setCompatPart(null)} onUpdate={() => queryClient.invalidateQueries(['parts'])} />}
    </div>
  );
}

function CompatibilityModal({ part, onClose, onUpdate }) {
  const { data: vehicles } = useQuery({ queryKey: ['vehicles'], queryFn: adminApi.getVehicles });
  const [vQuery, setVQuery] = useState('');
  const mapMutation = useMutation({ mutationFn: (vId) => adminApi.addCompatibility(part.id, vId), onSuccess: () => { onUpdate(); toast.show("Compatibility linked", "success"); }});
  const filteredV = vehicles?.filter(v => v.make?.toLowerCase().includes(vQuery.toLowerCase()) || v.model?.toLowerCase().includes(vQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl p-8 space-y-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center"><h2 className="text-xl font-black uppercase tracking-tighter">Linking Compatibility: <span className="text-brand-accent italic">{part.name}</span></h2><button onClick={onClose}><X/></button></div>
        <input type="text" placeholder="Find vehicle in matrix..." value={vQuery} onChange={e => setVQuery(e.target.value)} className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-brand-accent" />
        <div className="max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredV?.map(v => (<button key={v.id} onClick={() => mapMutation.mutate(v.id)} className="p-4 bg-white/5 rounded-xl text-left hover:bg-brand-accent hover:text-brand-dark transition-all group"><p className="font-bold text-xs uppercase">{v.make} {v.model}</p><p className="text-[10px] opacity-60 group-hover:opacity-100">{v.yearRange}</p></button>))}
        </div>
      </div>
    </div>
  );
}

// --- PHASE 3.2: CUSTOMER DIRECTORY ---
function CustomerDirectory() {
  const [q, setQ] = useState('');
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: adminApi.getCustomers });
  const filtered = customers?.filter(c => c.email?.toLowerCase().includes(q.toLowerCase()) || c.firstName?.toLowerCase().includes(q.toLowerCase()));

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    toast.show("Email copied to clipboard", "success");
  };

  const exportToCSV = () => {
    const headers = "ID,Name,Email,Orders,Total Spent\n";
    const rows = filtered.map(c => `${c.id},"${c.firstName} ${c.lastName}","${c.email}",${c.orderCount || 0},${c.totalSpent || 0}`).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([headers + rows], { type: 'text/csv' }));
    link.download = `AutoHub_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.show("Directory exported", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500"/><input type="text" placeholder="Search by email/name..." value={q} onChange={e => setQ(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2 pl-10 rounded-xl text-sm" /></div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-[10px] uppercase font-bold rounded-lg hover:bg-white/10"><Download size={14}/> Export CSV</button>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold"><tr><th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Orders</th><th className="p-4">LTV</th></tr></thead>
          <tbody className="text-slate-300">
            {filtered?.map(c => (<tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="p-4 font-bold">{c.firstName} {c.lastName}</td>
              <td className="p-4 font-mono text-brand-accent flex items-center gap-2">
                {c.email}
                <button onClick={() => copyToClipboard(c.email)} className="text-slate-500 hover:text-white"><Copy size={12}/></button>
              </td>
              <td className="p-4">{c.orderCount || 0}</td>
              <td className="p-4 font-black tracking-tighter text-white">${Number(c.totalSpent || 0).toFixed(2)}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- PHASE 1.1: CATEGORY MANAGER ---
function CategoryManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categories } = useQuery({ queryKey: ['categories', searchTerm], queryFn: () => adminApi.getCategories(searchTerm)});
  const deleteMutation = useMutation({ mutationFn: adminApi.deleteCategory, onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.show("Category purged", "success"); }});
  return (
    <div className="space-y-6">
      <div className="relative w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500"/><input type="text" placeholder="Search departments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2 pl-10 rounded-xl text-sm" /></div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left"><thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold"><tr><th className="p-4">Name</th><th className="p-4">Description</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="text-xs">{categories?.map(cat => (<tr key={cat.id} className="border-b border-white/5"><td className="p-4 font-bold">{cat.name}</td><td className="p-4 opacity-60">{cat.description}</td><td className="p-4 text-right"><button onClick={() => { if(window.confirm('Purge department?')) deleteMutation.mutate(cat.id); }} className="text-red-400 hover:text-red-500"><Trash2 size={16}/></button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// --- PHASE 1.2: VEHICLE MATRIX ---
function VehicleManager() {
  const queryClient = useQueryClient();
  const { data: vehicles } = useQuery({ queryKey: ['vehicles'], queryFn: adminApi.getVehicles });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vehicles?.map(v => (
        <div key={v.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center group">
          <div><p className="font-black uppercase text-sm">{v.make} <span className="text-brand-accent italic">{v.model}</span></p><p className="text-[10px] text-slate-500 mt-1">{v.yearRange}</p></div>
          <button onClick={() => { if(window.confirm('Delete vehicle?')) adminApi.deleteVehicle(v.id).then(() => queryClient.invalidateQueries(['vehicles'])); }} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
        </div>
      ))}
    </div>
  );
}

// --- PHASE 3.1: OPERATIONS & STATS ---
function OperationsSection() {
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });
  const { data: clerks } = useQuery({ queryKey: ['clerks'], queryFn: () => adminApi.getClerks('') });
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} />
        <MetricCard title="Orders" value={stats?.totalOrders || 0} />
        <MetricCard title="Low Stock" value={stats?.lowStockCount || 0} />
        <MetricCard title="Customers" value={stats?.totalCustomers || 0} />
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-xl">
        <h3 className="text-xs font-black uppercase mb-4 tracking-widest">Operator Registry</h3>
        <div className="space-y-2">
          {clerks?.map(c => (<div key={c.id} className="flex justify-between items-center p-3 border-border border-white/5 rounded-lg"><div><p className="text-xs font-bold">{c.firstName} {c.lastName}</p><p className="text-[10px] text-slate-500 font-mono">{c.email}</p></div><button onClick={() => { if(window.confirm('Revoke access?')) adminApi.deleteClerk(c.id).then(() => queryClient.invalidateQueries(['clerks'])); }}><Trash2 size={16} className="text-red-500/50 hover:text-red-500"/></button></div>))}
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
  return <div className="space-y-1"><label className="text-[10px] text-slate-500 uppercase font-black">{label}</label><input value={val} onChange={e => set(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-brand-accent" placeholder={ph} /></div>;
}
function MetricCard({ title, value }) {
  return <div className="bg-white/5 border border-white/10 p-6 rounded-2xl"><p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p><p className="text-2xl font-black text-white mt-1">{value}</p></div>;
}