import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Phone, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { toast } from '../../context/NotificationContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    businessName: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Aligns perfectly with RegisterRequest.java fields
      await authApi.register(formData); 
      toast.show("Operator Account Initialized.", "success");
      navigate('/login');
    } catch (err) {
      setIsSubmitting(false);
      // Backend GlobalExceptionHandler will push specific validation errors here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 font-sans py-12">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Register <span className="text-brand-accent italic">Entity</span>
          </h2>
          <p className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">System Enrollment Terminal</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-600 group-focus-within:text-brand-accent" />
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="First Name"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="relative group">
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Last Name"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-600 group-focus-within:text-brand-accent" />
            <input
              type="email"
              required
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
              placeholder="Email Address"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-600 group-focus-within:text-brand-accent" />
            <input
              type="password"
              required
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
              placeholder="Password (min. 8 chars)"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Phone"
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Building className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
                placeholder="Business"
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>
          </div>

          <div className="relative group">
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />
            <input
              type="text"
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-9 text-sm text-white focus:border-brand-accent focus:outline-none transition-all"
              placeholder="Physical Address"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex justify-center items-center py-4 rounded-xl text-brand-dark bg-brand-accent font-black uppercase tracking-widest hover:bg-teal-400 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-brand-accent/20"
          >
            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Authorize Account Creation'}
          </button>

          <Link to="/login" className="w-full flex items-center justify-center gap-2 text-[10px] text-slate-500 hover:text-brand-accent transition-colors uppercase font-bold tracking-widest pt-4">
            <ArrowLeft className="h-3 w-3" /> Return to Terminal
          </Link>
        </form>
      </div>
    </div>
  );
}