import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (result.mfaRequired) {
          navigate('/verify-mfa', { state: { email } });
          return;
        }

        // Strict Redirection Mapping
        switch (result.role) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'CLERK':
          case 'CUSTOMER':
            navigate('/warehouse');
            break;
          default:
            setError("Unauthorized Identity: Access Denied");
            setIsSubmitting(false);
        }
      } else {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Terminal Connection Failure");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div>
          <h2 className="text-center text-3xl font-black text-white tracking-tighter uppercase">
            AutoHub <span className="text-brand-accent italic">Systems</span>
          </h2>
          <p className="mt-2 text-center text-xs font-mono text-slate-500 uppercase tracking-widest">
            Operator Terminal Access
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <p className="text-xs text-red-400 font-bold uppercase tracking-tight">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-all"
                placeholder="operator@autohub.com"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" size="sm" className="text-xs text-brand-accent hover:text-teal-400 font-bold uppercase tracking-tighter transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-brand-accent/10"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Initialize Session'}
          </button>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              New Operator? {' '}
              <Link to="/register" className="text-brand-accent hover:underline font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}