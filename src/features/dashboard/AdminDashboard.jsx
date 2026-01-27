import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Users, Activity, Loader2, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [clerkEmail, setClerkEmail] = useState('');
  const [clerkPass, setClerkPass] = useState('');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats
  });

  const mutation = useMutation({
    mutationFn: adminApi.createClerk,
    onSuccess: () => {
      toast.show("Clerk account provisioned successfully", "success");
      setClerkEmail('');
      setClerkPass('');
    },
    onError: (err) => toast.show(err.response?.data?.message || "Provisioning failed", "error")
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-brand-dark">
      <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin <span className="text-brand-accent italic">Terminal</span></h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">System Authority Level: ROOT</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} icon={<DollarSign />} />
        <MetricCard title="Total Orders" value={stats?.totalOrders || 0} icon={<Package />} />
        <MetricCard title="Customer Base" value={stats?.totalCustomers || 0} icon={<Users />} />
        <MetricCard title="Inventory Alerts" value={stats?.lowStockCount || 0} icon={<Activity />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clerk Provisioning Tool */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-brand-accent" /> Staff Provisioning
          </h3>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({ email: clerkEmail, password: clerkPass });
          }}>
            <input 
              type="email" 
              placeholder="Operator Email" 
              value={clerkEmail}
              onChange={(e) => setClerkEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-lg text-white text-sm focus:border-brand-accent outline-none"
              required
            />
            <input 
              type="password" 
              placeholder="Initial Access Token (Password)" 
              value={clerkPass}
              onChange={(e) => setClerkPass(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-lg text-white text-sm focus:border-brand-accent outline-none"
              required
            />
            <button 
              disabled={mutation.isLoading}
              className="w-full py-3 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-all"
            >
              {mutation.isLoading ? 'Processing...' : 'Provision Clerk Account'}
            </button>
          </form>
        </div>

        {/* System Health / Placeholder Chart */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
             <Activity className="h-12 w-12 text-brand-accent/20 mb-4" />
             <p className="text-white font-bold uppercase tracking-widest text-sm">Automated Stock Control</p>
             <p className="text-slate-500 text-xs mt-2 max-w-xs">System is currently monitoring {stats?.lowStockCount} critical inventory points.</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent w-fit mb-4">{icon}</div>
      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </div>
  );
}