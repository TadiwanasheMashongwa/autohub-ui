import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings, Search, Users 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            System <span className="text-brand-accent italic">Architect</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Terminal Level: Root Authority</p>
        </div>

        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Catalog" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Users size={14}/>} label="Staff/Stats" />
        </nav>
      </div>

      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'ops' && <OperationsSection />}
    </div>
  );
}

// --- CLERK REGISTRY & STATS (PHASE 3) ---
function OperationsSection() {
  const queryClient = useQueryClient();
  const [clerkSearch, setClerkSearch] = useState('');
  const [clerk, setClerk] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });
  const { data: clerks, isLoading } = useQuery({ 
    queryKey: ['clerks', clerkSearch], 
    queryFn: () => adminApi.getClerks(clerkSearch) 
  });

  const clerkMutation = useMutation({
    mutationFn: adminApi.createClerk,
    onSuccess: () => {
      queryClient.invalidateQueries(['clerks']);
      toast.show("Clerk account provisioned", "success");
      setClerk({ email: '', password: '', firstName: '', lastName: '' });
    }
  });

  const deleteClerkMutation = useMutation({
    mutationFn: adminApi.deleteClerk,
    onSuccess: () => {
      queryClient.invalidateQueries(['clerks']);
      toast.show("Access revoked", "success");
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} />
        <MetricCard title="Total Orders" value={stats?.totalOrders || 0} />
        <MetricCard title="Low Stock" value={stats?.lowStockCount || 0} />
        <MetricCard title="Customer Base" value={stats?.totalCustomers || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registry Table */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest">Operator Registry</h3>
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
              <input 
                type="text" value={clerkSearch} onChange={e => setClerkSearch(e.target.value)}
                className="bg-slate-900 border border-white/10 pl-7 pr-3 py-1.5 rounded-lg text-[10px] text-white outline-none focus:border-brand-accent"
                placeholder="Find operator..."
              />
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {clerks?.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 border-b border-white/5 hover:bg-white/[0.02]">
                <div>
                  <p className="text-xs font-bold">{c.firstName} {c.lastName}</p>
                  <p className="text-[10px] text-slate-500">{c.email}</p>
                </div>
                <button onClick={() => { if(window.confirm('Revoke access?')) deleteClerkMutation.mutate(c.id); }} className="text-red-500/50 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Provisioning Form */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6">Staff Provisioning</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); clerkMutation.mutate(clerk); }}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={clerk.firstName} onChange={e => setClerk({...clerk, firstName: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded text-xs" required />
              <input type="text" placeholder="Last Name" value={clerk.lastName} onChange={e => setClerk({...clerk, lastName: e.target.value})} className="bg-slate-900 border border-white/10 p-3 rounded text-xs" required />
            </div>
            <input type="email" placeholder="Email Address" value={clerk.email} onChange={e => setClerk({...clerk, email: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-3 rounded text-xs" required />
            <input type="password" placeholder="Access Token (Password)" value={clerk.password} onChange={e => setClerk({...clerk, password: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-3 rounded text-xs" required />
            <button className="w-full py-4 bg-brand-accent text-brand-dark font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-400">Initialize Operator</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* --- SHARED UI HELPERS --- */
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>
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
// Note: CategoryManager and VehicleManager code should remain from previous steps.