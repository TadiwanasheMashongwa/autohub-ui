import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '../../context/NotificationContext.jsx';
import apiClient from '../../api/apiClient.js';

export default function MFAVerify() {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const tempToken = location.state?.tempToken;
  const userEmail = location.state?.email;

  useEffect(() => {
    if (!tempToken) {
      toast.show("Session invalid. Please login again.", "error");
      navigate('/login');
    }
  }, [tempToken, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.show("Please enter a 6-digit code", "error");

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/mfa/verify', {
        email: userEmail,
        code: code,
        tempToken: tempToken
      });

      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.show("Identity Verified", "success");
      navigate('/');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans text-white">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-accent/10 rounded-full flex items-center justify-center mb-4 text-brand-accent">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Security Check</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter the code sent to <span className="text-slate-200">{userEmail}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="flex justify-center">
            <input
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-48 text-center bg-brand-dark border-2 border-white/10 rounded-xl py-4 text-3xl font-mono tracking-[0.5em] text-brand-accent focus:outline-none focus:border-brand-accent transition-all"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-brand-dark bg-brand-accent font-bold hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Identity'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors font-mono uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}