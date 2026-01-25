import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';
import { DollarSign, Package, Users, Activity, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getSystemMetrics
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-stats'],
    queryFn: adminApi.getRevenueStats
  });

  if (loadingMetrics) return (
    <div className="h-screen flex items-center justify-center bg-brand-dark">
      <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Operations <span className="text-brand-accent italic">Hub</span></h1>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Real-time System Oversight • January 2026</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={`$${metrics?.totalRevenue}`} icon={<DollarSign />} trend="+12.5%" />
        <MetricCard title="Active Orders" value={metrics?.activeOrders} icon={<Package />} trend="+3" />
        <MetricCard title="Operator Count" value={metrics?.operatorCount} icon={<Users />} />
        <MetricCard title="System Health" value="99.9%" icon={<Activity />} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Flow Chart */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Revenue Forecast (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#38b2ac', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#38b2ac" strokeWidth={3} dot={{ fill: '#38b2ac' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Stock Health */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center flex flex-col justify-center">
            <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-widest">System Efficiency</h3>
            <p className="text-slate-400 text-xs mb-8">Order processing speed and stock accuracy</p>
            <div className="flex justify-around items-end h-48 px-8">
                <StatBar label="Picking" percent={88} />
                <StatBar label="Shipping" percent={94} />
                <StatBar label="Inventory" percent={99} />
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">{icon}</div>
        {trend && <span className="text-emerald-500 text-xs font-bold">{trend}</span>}
      </div>
      <div className="mt-4">
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function StatBar({ label, percent }) {
    return (
        <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-8 bg-slate-800 rounded-t-lg relative overflow-hidden h-32">
                <div 
                    className="absolute bottom-0 w-full bg-brand-accent transition-all duration-1000" 
                    style={{ height: `${percent}%` }}
                />
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{label}</span>
        </div>
    );
}