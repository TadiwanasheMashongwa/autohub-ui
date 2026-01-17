import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.show("Passwords do not match", "error");
    if (!token) return toast.show("Invalid reset token", "error");

    setIsSubmitting(true);
    const result = await resetPassword(token, newPassword);
    
    if (result.success) {
      toast.show("Password updated successfully", "success");
      navigate('/login');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-center text-3xl font-black text-white uppercase tracking-tighter">New <span className="text-brand-accent">Credentials</span></h2>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
              placeholder="New Password"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent transition-all"
              placeholder="Confirm New Password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex justify-center py-3.5 px-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}