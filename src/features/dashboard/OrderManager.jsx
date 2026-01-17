import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../../api/orderApi';
import { toast } from '../../context/NotificationContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Loader2,
  Box
} from 'lucide-react';

const STATUS_MAP = {
  PENDING: { color: 'text-amber-400 bg-amber-500/10', icon: <Clock className="h-4 w-4" />, next: 'PICKED' },
  PICKED: { color: 'text-blue-400 bg-blue-500/10', icon: <Box className="h-4 w-4" />, next: 'SHIPPED' },
  SHIPPED: { color: 'text-purple-400 bg-purple-500/10', icon: <Truck className="h-4 w-4" />, next: 'DELIVERED' },
  DELIVERED: { color: 'text-emerald-400 bg-emerald-500/10', icon: <CheckCircle2 className="h-4 w-4" />, next: null },
};

export default function OrderManager() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.show("Order Status Synchronized", "success");
    }
  });

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-accent" /></div>;

  return (
    <div className="p-8 space-y-6 bg-brand-dark min-h-screen">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
          Fulfillment <span className="text-brand-accent italic">Pipeline</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Live Order Lifecycle Management</p>
      </div>

      <div className="grid gap-4">
        {orders?.content?.map((order) => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between group hover:border-brand-accent/30 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className={`p-4 rounded-xl ${STATUS_MAP[order.status].color}`}>
                {STATUS_MAP[order.status].icon}
              </div>
              
              <div>
                <h3 className="text-white font-bold uppercase text-sm tracking-tight">Order #{order.id.substring(0,8)}</h3>
                <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase">{order.customerName} • {order.itemsCount} Items</p>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Amount</p>
                <p className="text-white font-black">${order.totalAmount.toFixed(2)}</p>
              </div>

              {STATUS_MAP[order.status].next && (
                <button 
                  onClick={() => mutation.mutate({ id: order.id, status: STATUS_MAP[order.status].next })}
                  disabled={mutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-dark font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-teal-400 transition-all active:scale-95 disabled:opacity-50"
                >
                  Mark as {STATUS_MAP[order.status].next}
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}