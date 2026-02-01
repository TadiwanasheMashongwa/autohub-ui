import { Package } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../../api/orderApi';

const StatusBadge = ({ status }) => {
  const configs = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    PAID: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PICKED: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    SHIPPED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-tighter ${configs[status] || "bg-slate-500/10 text-slate-500 border-slate-500/20"}`}>
      {status}
    </span>
  );
};

export default function OrderHistory() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getMyOrders
  });

  const safeFormatDate = (dateValue) => {
    if (!dateValue) return 'Date Unknown';
    const date = new Date(dateValue);
    return isValid(date) ? format(date, 'PPP p') : 'Date Unknown';
  };

  if (isLoading) return (
    <div className="p-8 text-slate-500 font-mono text-xs animate-pulse">
      SCANNING ORDER MANIFESTS...
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Order <span className="text-brand-accent">Archives</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase mt-1">Terminal Session: Stable</p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="border border-white/5 bg-white/5 rounded-2xl p-12 text-center">
            <Package className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-mono text-xs uppercase">No active manifests found.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-brand-accent/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-slate-500 text-xs font-mono">
                    {safeFormatDate(order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Visual Strip for Customer Verification */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="h-12 w-12 rounded bg-black/40 border border-white/5 flex-shrink-0 overflow-hidden group relative">
                    {item.part?.imageUrl ? (
                      <img 
                        src={item.part.imageUrl} 
                        alt=""
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <Package className="h-full w-full p-3 opacity-20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}