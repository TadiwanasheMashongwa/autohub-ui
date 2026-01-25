import { useAuth } from '../../features/auth/AuthContext';
import { LogOut, User, Settings, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-brand-dark/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-brand-accent rounded-lg flex items-center justify-center font-black text-brand-dark">
            A
          </div>
          <span className="text-white font-black uppercase tracking-tighter">
            AutoHub <span className="text-brand-accent">OS</span>
          </span>
        </div>

        {/* Identity & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-white text-xs font-bold uppercase tracking-tight">
              {user.email}
            </span>
            <span className="text-[10px] text-brand-accent font-mono uppercase font-bold flex items-center gap-1">
              <Shield className="h-2.5 w-2.5" /> {user.role} Terminal
            </span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* THE LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group"
            title="Terminate Session"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              Exit Terminal
            </span>
            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}