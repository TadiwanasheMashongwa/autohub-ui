import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import { useState } from 'react';
import { toast } from '../../context/NotificationContext';
import { 
  Layers, Car, Trash2, Plus, Loader2, Save, X, Edit3, Settings, Search, Users, Download, Package, AlertTriangle, Link as LinkIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory'); // Starting with Phase 2 active

  return (
    <div className="p-8 space-y-8 bg-brand-dark min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">System <span className="text-brand-accent italic">Architect</span></h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Terminal Level: Root Authority</p>
        </div>
        <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <TabBtn active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={14}/>} label="Inventory" />
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={14}/>} label="Catalog" />
          <TabBtn active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={14}/>} label="Vehicles" />
          <TabBtn active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={14}/>} label="Customers" />
          <TabBtn active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} icon={<Settings size={14}/>} label="Staff/Stats" />
        </nav>
      </div>

      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'vehicles' && <VehicleManager />}
      {activeTab === 'customers' && <CustomerDirectory />}
      {activeTab === 'ops' && <OperationsSection />}
    </div>
  );
}

// --- PHASE 2: INVENTORY MANAGER ---
function InventoryManager() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [compatPart, setCompatPart] = useState(null); // Part currently being mapped
  const [newPart, setNewPart] = useState({ name: '', sku: '', barcode: '', price: 0, stockQuantity: 0, brand: '', condition: 'NEW' });

  const { data: partsData, isLoading } = useQuery({ 
    queryKey: ['parts', q], 
    queryFn: () => adminApi.getParts(q) 
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createPart,
    onSuccess: () => { queryClient.invalidateQueries(['parts']); setIsAdding(false); toast.show("Part initialized", "success"); }
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, qty }) => adminApi.adjustStock(id, qty),
    onSuccess: () => { queryClient.invalidateQueries(['parts']); toast.show("Stock authority updated", "success"); }
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input type="text" placeholder="Search SKU/Name..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-2.5 pl-10 rounded-xl text-white text-sm" />
        </div>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent text-brand-dark font-black text-[10px] uppercase rounded-lg"><Plus size={14}/> New Part</button>}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-brand-accent/30 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputGroup label="Name" val={newPart.name} set={v => setNewPart({...newPart, name:v})} ph="Oil Filter" />
          <InputGroup label="SKU" val={newPart.sku} set={v => setNewPart({...newPart, sku:v})} ph="OF-101" />
          <InputGroup label="Barcode" val={newPart.barcode} set={v => setNewPart({...newPart, barcode:v})} ph="77123..." />
          <InputGroup label="Price" val={newPart.price} set={v => setNewPart({...newPart, price:v})} ph="15.00" />
          <InputGroup label="Stock" val={newPart.stockQuantity} set={v => setNewPart({...newPart, stockQuantity:v})} ph="50" />
          <InputGroup label="Brand" val={newPart.brand} set={v => setNewPart({...newPart, brand:v})} ph="Bosch" />
          <div className="flex gap-2 items-end">
            <button onClick={() => setIsAdding(false)} className="p-3 text-slate-500"><X/></button>
            <button onClick={() => createMutation.mutate(newPart)} className="bg-brand-accent text-brand-dark p-3 rounded-lg w-full"><Save size={20}/></button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-slate-400 font-bold">
            <tr><th className="p-4">Product Detail</th><th className="p-4">SKU/Brand</th><th className="p-4">Inventory</th><th className="p-4 text-right">Gatekeeper</th></tr>
          </thead>
          <tbody className="text-xs text-slate-300">
            {partsData?.content?.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4"><p className="text-white font-bold">{p.name}</p><p className="text-[10px] text-brand-accent uppercase font-black">{p.condition}</p></td>
                <td className="p-4 font-mono text-slate-400">{p.sku} | {p.brand}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-black ${p.stockQuantity <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{p.stockQuantity} units</span>
                  </div>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => setCompatPart(p)} className="text-slate-400 hover:text-brand-accent"><LinkIcon size={16}/></button>
                  <button onClick={() => {
                    const newQty = window.prompt("Force Adjust Stock:", p.stockQuantity);
                    if (newQty) stockMutation.mutate({ id: p.id, qty: parseInt(newQty) });
                  }} className="text-slate-400 hover:text-white"><Edit3 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPATIBILITY MODAL */}
      {compatPart && (
        <CompatibilityModal 
          part={compatPart} 
          onClose={() => setCompatPart(null)} 
          onUpdate={() => queryClient.invalidateQueries(['parts'])} 
        />
      )}
    </div>
  );
}

function CompatibilityModal({ part, onClose, onUpdate }) {
  const { data: vehicles } = useQuery({ queryKey: ['vehicles'], queryFn: adminApi.getVehicles });
  const [vQuery, setVQuery] = useState('');

  const mapMutation = useMutation({
    mutationFn: (vId) => adminApi.addCompatibility(part.id, vId),
    onSuccess: () => { onUpdate(); toast.show("Link established", "success"); }
  });

  const filteredV = vehicles?.filter(v => 
    v.make.toLowerCase().includes(vQuery.toLowerCase()) || 
    v.model.toLowerCase().includes(vQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter">Linking Compatibility: <span className="text-brand-accent italic">{part.name}</span></h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X/></button>
        </div>
        <input type="text" placeholder="Find vehicle in matrix..." value={vQuery} onChange={e => setVQuery(e.target.value)} className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-brand-accent" />
        <div className="max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredV?.map(v => (
            <button key={v.id} onClick={() => mapMutation.mutate(v.id)} className="p-4 bg-white/5 rounded-xl text-left hover:bg-brand-accent hover:text-brand-dark transition-all group">
              <p className="font-bold uppercase text-xs">{v.make} {v.model}</p>
              <p className="text-[10px] opacity-60 group-hover:opacity-100">{v.yearRange}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ... (Sub-components: CategoryManager, VehicleManager, CustomerDirectory, OperationsSection, Shared UI helpers remain integrated as before)