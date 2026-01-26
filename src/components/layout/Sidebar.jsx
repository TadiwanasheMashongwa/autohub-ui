import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../context/CartContext'; // NEW: Import Cart Context
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Truck,
  ShoppingBag // NEW: Icon for the Cart
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart(); // NEW: Access Cart State
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  // Define navigation based on Role
  const navItems = [
    { label: 'Warehouse', path: '/warehouse', icon: Package, roles: ['ADMIN', 'CLERK', 'CUSTOMER'] },
    { label: 'Orders', path: '/orders', icon: Truck, roles: ['ADMIN', 'CLERK', 'CUSTOMER'] },
    { label: 'Admin Terminal', path: '/admin', icon: ShieldCheck, roles: ['ADMIN'] },
    { label: 'Audit Logs', path: '/audit', icon: History, roles: ['ADMIN'] },
  ];

  // CHECKLIST: Live Item Count Logic
  const itemCount = cart?.itemCount || 0;

  return (
    <aside className="w-64 h-screen bg-brand-dark border-r border-white/5 flex flex-col fixed left-0 top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-black text-white uppercase tracking-tighter">
          AutoHub <span className="text-brand-accent italic">OS</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">v1.0.4-stable</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive(item.path) 
                ? 'bg-brand-accent text-brand-dark font-bold' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-brand-dark' : 'text-slate-500 group-hover:text-brand-accent'}`} />
              <span className="text-sm uppercase tracking-wide">{item.label}</span>
            </Link>
          ))}

        {/* CHECKLIST: Global Header Sync - Shopping Cart Trigger */}
        {user?.role === 'CUSTOMER' && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-slate-500 group-hover:text-brand-accent" />
              <span className="text-sm uppercase tracking-wide">Shopping Cart</span>
            </div>
            
            {/* LIVE COUNT BADGE */}
            {itemCount > 0 && (
              <span className="bg-brand-accent text-brand-dark text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </nav>

      {/* User Identity & Logout Button */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
            <span className="text-brand-accent text-xs font-bold uppercase">{user?.email?.[0]}</span>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs text-white font-bold truncate">{user?.email}</span>
            <span className="text-[9px] text-brand-accent font-mono uppercase tracking-tighter">{user?.role} Mode</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}