import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    
    if (result.success) {
      toast.show("Recovery email sent if account exists", "success");
      navigate('/login');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Reset <span className="text-brand-accent">Access</span></h2>
          <p className="mt-2 text-sm text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
              placeholder="operator@autohub.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Recovery Email'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}