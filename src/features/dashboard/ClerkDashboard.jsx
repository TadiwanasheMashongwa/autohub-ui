import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Package, 
  Truck, 
  ScanLine, 
  Barcode, 
  CheckCircle, 
  X, 
  Loader2, 
  AlertTriangle, 
  ClipboardCheck, 
  Search 
} from 'lucide-react';

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState('dispatch');

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen text-white font-sans">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Warehouse <span className="text-brand-accent">Ops</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
            Terminal ID: CLERK-01 // Authorized Personnel Only
          </p>
        </div>
        <div className="flex gap-2">
          <NavBtn 
            label="Dispatch Console" 
            active={activeTab === 'dispatch'} 
            onClick={() => setActiveTab('dispatch')} 
            icon={<Truck size={14}/>} 
          />
          <NavBtn 
            label="Inventory Search" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
            icon={<Package size={14}/>} 
          />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dispatch' ? <DispatchConsole /> : <InventoryLookup />}
      </div>
    </div>
  );
}

function DispatchConsole() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({ 
    queryKey: ['active-orders'], 
    queryFn: adminApi.getActiveOrders 
  });
  
  const [activeManifest, setActiveManifest] = useState(null);
  const [shippingId, setShippingId] = useState(null);
  const [logistics, setLogistics] = useState({ courier: '', tracking: '' });

  const updateLogistics = useMutation({
    mutationFn: (id) => adminApi.updateLogistics(id, {
      courier: logistics.courier,
      tracking: logistics.tracking
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-orders']);
      queryClient.invalidateQueries(['orders']); 
      setShippingId(null);
      setLogistics({ courier: '', tracking: '' });
      toast.show("Shipping Confirmed. Customer Notified.", "success");
    },
    onError: (err) => {
      const msg = err.response?.status === 403 ? "Terminal Restricted: Access Denied" : "Dispatch Failed";
      toast.show(msg, "error");
    }
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-accent h-8 w-8"/></div>;

  if (activeManifest) {
    return <PickingTerminal order={activeManifest} onBack={() => setActiveManifest(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-accent/10 border border-brand-accent/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-brand-accent text-xs font-black uppercase tracking-widest">Picking Queue</p>
            <p className="text-3xl font-black text-white mt-1">{orders?.filter(o => o.status === 'PAID').length || 0}</p>
          </div>
          <ClipboardCheck className="text-brand-accent h-8 w-8 opacity-50" />
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-blue-500 text-xs font-black uppercase tracking-widest">Shipping Queue</p>
            <p className="text-3xl font-black text-white mt-1">{orders?.filter(o => o.status === 'PICKED').length || 0}</p>
          </div>
          <Truck className="text-blue-500 h-8 w-8 opacity-50" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-500 uppercase font-bold border-b border-white/5">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {orders?.map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-mono text-brand-accent">#{o.id}</td>
                <td className="p-4">{o.user?.email}</td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
                <td className="p-4 text-right">
                  {o.status === 'PAID' ? (
                    <button 
                      onClick={() => setActiveManifest(o)} 
                      className="bg-brand-accent text-brand-dark px-4 py-2 rounded-lg font-black uppercase text-[10px] flex items-center gap-2 ml-auto hover:scale-105 transition-all"
                    >
                      <ScanLine size={14}/> Initialize Pick
                    </button>
                  ) : o.status === 'PICKED' ? (
                    shippingId === o.id ? (
                        <div className="flex gap-2 justify-end animate-in slide-in-from-right">
                          <input 
                            placeholder="Courier" 
                            className="bg-black/40 border border-white/10 p-2 rounded text-[10px] w-24 outline-none focus:border-brand-accent text-white" 
                            value={logistics.courier} 
                            onChange={e => setLogistics({...logistics, courier: e.target.value})} 
                          />
                          <input 
                            placeholder="Tracking #" 
                            className="bg-black/40 border border-white/10 p-2 rounded text-[10px] w-32 outline-none focus:border-brand-accent text-white" 
                            value={logistics.tracking} 
                            onChange={e => setLogistics({...logistics, tracking: e.target.value})} 
                          />
                          <button 
                            onClick={() => updateLogistics.mutate(o.id)} 
                            disabled={!logistics.courier || !logistics.tracking || updateLogistics.isPending} 
                            className="bg-teal-500 text-black px-3 rounded font-bold hover:bg-teal-400 disabled:opacity-50 text-[10px] uppercase"
                          >
                            {updateLogistics.isPending ? '...' : 'Save'}
                          </button>
                          <button onClick={() => setShippingId(null)} className="p-2 text-slate-500 hover:text-white">
                            <X size={14}/>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShippingId(o.id)} 
                          className="bg-white/10 px-4 py-2 rounded-lg font-bold uppercase text-[10px] ml-auto hover:bg-white/20 transition-all text-white"
                        >
                          Dispatch
                        </button>
                      )
                  ) : <span className="text-slate-600 text-[10px] uppercase font-bold italic opacity-50">Locked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PickingTerminal({ order, onBack }) {
  const queryClient = useQueryClient();
  const [scans, setScans] = useState({}); 
  const [feedback, setFeedback] = useState({});

  const verifyMutation = useMutation({
    mutationFn: () => adminApi.updateOrderStatus(order.id, 'PICKED'),
    onSuccess: () => {
      queryClient.invalidateQueries(['active-orders']);
      queryClient.invalidateQueries(['orders']); 
      toast.show("Manifest Verified & Locked.", "success");
      onBack();
    }
  });

  const handleScan = (itemId, val, correct) => {
    setScans(prev => ({...prev, [itemId]: val}));
    if (val === correct) setFeedback(prev => ({...prev, [itemId]: 'valid'}));
    else if (val.length >= correct.length) setFeedback(prev => ({...prev, [itemId]: 'invalid'}));
    else setFeedback(prev => ({...prev, [itemId]: null}));
  };

  const allVerified = order.items.every(i => scans[i.id] === i.part.barcode);

  return (
    <div className="bg-black/20 border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto animate-in zoom-in-95">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            Picking Manifest <span className="text-brand-accent">#{order.id}</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase">Scan all items to verify physical stock</p>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full text-white"><X/></button>
      </div>

      <div className="space-y-4">
        {order.items.map(item => {
          const status = feedback[item.id];
          return (
            <div key={item.id} className={`p-5 rounded-xl border transition-all ${
              status === 'valid' ? 'bg-teal-500/10 border-teal-500 text-teal-500' :
              status === 'invalid' ? 'bg-red-500/10 border-red-500 text-red-500' :
              'bg-white/5 border-white/5'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded text-white uppercase">
                      Bin: {item.part.binLocation || 'A-00'}
                    </span>
                    <span className="text-[10px] font-mono opacity-50 uppercase text-slate-400">
                      {item.part.sku}
                    </span>
                  </div>
                  <p className="font-bold text-lg uppercase text-white">{item.part.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  {status === 'valid' ? <CheckCircle className="animate-bounce"/> : 
                   status === 'invalid' ? <AlertTriangle className="animate-pulse"/> : 
                   <Barcode className="opacity-50 text-white"/>}
                  <input 
                    autoFocus={!status}
                    disabled={status === 'valid'}
                    placeholder="SCAN BARCODE"
                    className="bg-black/50 border border-white/10 rounded-lg p-3 w-48 text-center font-mono text-sm focus:border-brand-accent outline-none text-white uppercase"
                    onChange={(e) => handleScan(item.id, e.target.value, item.part.barcode)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        disabled={!allVerified || verifyMutation.isPending}
        onClick={() => verifyMutation.mutate()}
        className={`w-full mt-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
          allVerified ? 'bg-brand-accent text-brand-dark hover:brightness-110' : 'bg-white/5 text-slate-700 cursor-not-allowed'
        }`}
      >
        {verifyMutation.isPending ? <Loader2 className="animate-spin mx-auto"/> : 'Finalize & Confirm Picking'}
      </button>
    </div>
  );
}

function InventoryLookup() {
  const [q, setQ] = useState('');
  const { data: parts } = useQuery({ 
    queryKey: ['parts', q], 
    queryFn: () => adminApi.getParts(q) 
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500"/>
        <input 
          type="text" 
          placeholder="Lookup SKU / Part Name..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 text-sm focus:border-brand-accent outline-none text-white"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {parts?.content?.map(p => (
          <div key={p.id} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:border-brand-accent/30 transition-colors">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm uppercase text-white">{p.name}</h4>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${p.stockQuantity < 5 ? 'bg-red-500/20 text-red-500' : 'bg-teal-500/20 text-teal-500'}`}>
                {p.stockQuantity} QTY
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase">{p.sku}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavBtn({ label, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
        active ? 'bg-brand-accent text-brand-dark' : 'text-slate-400 hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PAID: 'text-brand-accent bg-brand-accent/10',
    PENDING: 'text-yellow-500 bg-yellow-500/10',
    PICKED: 'text-blue-500 bg-blue-500/10',
    SHIPPED: 'text-purple-500 bg-purple-500/10'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${styles[status] || 'text-slate-500'}`}>
      {status}
    </span>
  );
}