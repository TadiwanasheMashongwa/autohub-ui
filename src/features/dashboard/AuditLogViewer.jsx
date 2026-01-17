import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../../api/auditApi';
import { ShieldAlert, Search, Download, Clock, User, Activity, Loader2 } from 'lucide-react';

export default function AuditLogViewer() {
  const [filters, setFilters] = useState({ page: 0, size: 20, action: '' });
  
  const { data: logData, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditApi.getLogs(filters),
    keepPreviousData: true
  });

  const getActionStyle = (action) => {
    if (action.includes('DELETE') || action.includes('FAILED')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (action.includes('UPDATE') || action.includes('MFA')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-accent" /></div>;

  return (
    <div className="p-8 space-y-6 bg-brand-dark min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <ShieldAlert className="text-brand-accent h-6 w-6" />
            System <span className="text-brand-accent italic">Audit Trail</span>
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Immutable Activity Record</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-all text-xs font-bold uppercase">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Filter by Action (e.g. LOGIN_SUCCESS)..."
            className="w-full bg-slate-900 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:border-brand-accent outline-none"
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <th className="p-4 border-b border-white/5">Timestamp</th>
              <th className="p-4 border-b border-white/5">Operator</th>
              <th className="p-4 border-b border-white/5">Action</th>
              <th className="p-4 border-b border-white/5">IP Address</th>
              <th className="p-4 border-b border-white/5">Details</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {logData?.content?.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                <td className="p-4 text-slate-400 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 opacity-50" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td className="p-4 text-white font-bold">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-brand-accent" />
                    {log.username}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-tighter ${getActionStyle(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{log.ipAddress}</td>
                <td className="p-4 text-slate-300 max-w-xs truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}