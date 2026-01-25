import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { toast } from '../../context/NotificationContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Points to @PostMapping("/register") in your AuthenticationController
      await authApi.register(formData); 
      toast.show("Account initialized. Please login.", "success");
      navigate('/login');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Register <span className="text-brand-accent">Entity</span></h2>
          <p className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">Enroll new system operator</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Operator Name"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Email Address"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Building className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Business Name (Optional)"
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-600" />
              <input
                type="password"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Security Password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex justify-center items-center py-3.5 px-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 disabled:opacity-50 transition-all shadow-lg"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Operator Account'}
          </button>

          <Link to="/login" className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold pt-2">
            <ArrowLeft className="h-3 w-3" /> Back to Terminal
          </Link>
        </form>
      </div>
    </div>
  );
}