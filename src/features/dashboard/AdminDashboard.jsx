import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  DollarSign, Package, Users, Activity, Loader2, 
  UserPlus, Layers, Car, Trash2, Plus, MessageSquare, Tool 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ops');

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen">
      {/* Silicon Valley Grade Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Operations <span className="text-brand-accent italic">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            System Authority: Root • Jan 2026
          </p>
        </div>

        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Activity size={14}/>} label="Stats" />
          <TabBtn active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon={<Layers size={14}/>} label="Catalog" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeTab === 'sentiment'} onClick={() => setActiveTab('sentiment')} icon={<MessageSquare size={14}/>} label="Sentiment" />
        </nav>
      </div>

      {activeTab === 'ops' && <OperationsSection />}
      {activeTab === 'catalog' && <CatalogSection />}
      {activeTab === 'vehicles' && <VehicleSection />}
      {activeTab === 'sentiment' && <div className="text-slate-500 font-mono text-xs">Review Moderation Engine Initializing...</div>}
    </div>
  );
}

// --- TAB: OPERATIONS & STAFF ---
function OperationsSection() {
  const queryClient = useQueryClient();
  const [clerk, setClerk] = useState({ email: '', password: '' });
  const { data: stats, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });

  const clerkMutation = useMutation({
    mutationFn: adminApi.createClerk,
    onSuccess: () => {
      toast.show("Staff account provisioned", "success");
      setClerk({ email: '', password: '' });
    }
  });

  if (isLoading) return <Loader2 className="animate-spin text-brand-accent mx-auto" />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value={`$${stats?.totalRevenue?.toFixed(2)}`} icon={<DollarSign />} />
        <MetricCard title="Total Orders" value={stats?.totalOrders} icon={<Package />} />
        <MetricCard title="Active Customers" value={stats?.totalCustomers} icon={<Users />} />
        <MetricCard title="Stock Alerts" value={stats?.lowStockCount} icon={<Activity />} />
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-md">
        <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
          <UserPlus size={16} className="text-brand-accent" /> Staff Provisioning
        </h3>
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          clerkMutation.mutate(clerk);
        }}>
          <input 
            type="email" placeholder="Operator Email" value={clerk.email}
            onChange={e => setClerk({...clerk, email: e.target.value})}
            className="w-full bg-slate-900 border border-white/5 p-3 rounded-lg text-white text-sm outline-none focus:border-brand-accent"
          />
          <input 
            type="password" placeholder="Temporary Password" value={clerk.password}
            onChange={e => setClerk({...clerk, password: e.target.value})}
            className="w-full bg-slate-900 border border-white/5 p-3 rounded-lg text-white text-sm outline-none focus:border-brand-accent"
          />
          <button className="w-full py-3 bg-brand-accent text-brand-dark font-black uppercase text-xs tracking-widest rounded-lg transition-all hover:bg-teal-400">
            {clerkMutation.isLoading ? 'Provisioning...' : 'Generate Access'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- TAB: CATALOG (CATEGORIES & PARTS) ---
function CatalogSection() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: adminApi.getCategories });
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Global Categories</h3>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Parts Linked</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-300">
              {categories?.map(cat => (
                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-white">{cat.name}</td>
                  <td className="p-4 font-mono opacity-60">{cat.parts?.length || 0}</td>
                  <td className="p-4 text-right">
                    <button className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- TAB: VEHICLE COMPATIBILITY ---
function VehicleSection() {
  const { data: vehicles } = useQuery({ queryKey: ['vehicles'], queryFn: adminApi.getVehicles });

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Compatibility Matrix</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg">
          <Plus size={14}/> Add New Model
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map(v => (
          <div key={v.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-white font-bold">{v.make} {v.model}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase">{v.yearRange} • {v.engineCode}</p>
            </div>
            <button className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SHARED UI ---
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:text-white'}`}>
      {icon} {label}
    </button>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-accent/30 transition-all">
      <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent w-fit mb-4">{icon}</div>
      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
      <p className="text-2xl font-black text-white mt-1">{value || 0}</p>
    </div>
  );
}