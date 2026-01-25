import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Automatically extracts ?token=... from the URL
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.show("No reset token found. Please use the link from your email.", "error");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      return toast.show("Password must be at least 8 characters", "error");
    }
    
    if (newPassword !== confirmPassword) {
      return toast.show("Passwords do not match", "error");
    }
    
    if (!token) {
      return toast.show("Invalid or missing token.", "error");
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        toast.show("Credentials updated successfully.", "success");
        navigate('/login');
      }
    } catch (error) {
      console.error("Reset Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
        <div className="text-center p-8 bg-white/5 rounded-2xl border border-red-500/20 max-w-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white uppercase">Link Invalid</h2>
          <p className="text-slate-400 mt-2 text-sm">This reset terminal requires a valid security token from your email.</p>
          <button onClick={() => navigate('/login')} className="mt-6 text-brand-accent font-bold uppercase text-xs">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-accent/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-brand-accent" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">New <span className="text-brand-accent italic">Credentials</span></h2>
          <p className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">Update operator security profile</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-all"
              placeholder="New Secure Password"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-all"
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex justify-center py-3.5 px-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Finalize Update'}
          </button>
        </form>
      </div>
    </div>
  );
}