import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// --- Auth Components ---
import Login from './features/auth/Login';
import MFAVerify from './features/auth/MFAVerify';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';

// --- Feature Components ---
import PartCatalog from './features/catalog/PartCatalog';
import CartDrawer from './features/checkout/CartDrawer';
import CheckoutPage from './features/checkout/CheckoutPage';
import AdminDashboard from './features/dashboard/AdminDashboard';
import AuditLogViewer from './features/dashboard/AuditLogViewer';
import OrderManager from './features/dashboard/OrderManager';

// --- Routing & Security ---
import RoleGuard from './routes/RoleGuard';

/**
 * Global Operational Components
 */
const OrderSuccess = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark text-center p-6">
    <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
      <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Transaction Confirmed</h1>
    <p className="text-slate-500 font-mono mt-2 uppercase text-xs tracking-widest">Inventory successfully decremented</p>
    <button 
      onClick={() => window.location.href = '/warehouse'}
      className="mt-8 px-8 py-3 bg-brand-accent text-brand-dark font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all"
    >
      Return to Catalog
    </button>
  </div>
);

const Unauthorized = () => (
  <div className="h-screen flex items-center justify-center text-white bg-brand-dark">
    <div className="text-center">
      <h1 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">403</h1>
      <p className="text-slate-400 uppercase tracking-widest text-xs font-mono">Security Breach: Terminal Restricted</p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="mt-8 px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-xs uppercase font-bold"
      >
        Re-authenticate
      </button>
    </div>
  </div>
);

export default function App() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-dark selection:bg-brand-accent selection:text-brand-dark">
        {/* The Cart slides out over any route when triggered */}
        <CartDrawer />

        <Routes>
          {/* --- Public/Auth Routes --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-mfa" element={<MFAVerify />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* --- Clerk & Admin Routes --- */}
          <Route 
            path="/warehouse/*" 
            element={
              <RoleGuard allowedRoles={['CLERK', 'ADMIN']}>
                <PartCatalog />
              </RoleGuard>
            } 
          />

          <Route 
            path="/orders" 
            element={
              <RoleGuard allowedRoles={['CLERK', 'ADMIN']}>
                <OrderManager />
              </RoleGuard>
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <RoleGuard allowedRoles={['CLERK', 'ADMIN']}>
                <CheckoutPage />
              </RoleGuard>
            } 
          />

          <Route path="/dashboard/orders/success" element={<OrderSuccess />} />

          {/* --- Admin Only Routes --- */}
          <Route 
            path="/admin" 
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            } 
          />
          
          <Route 
            path="/admin/logs" 
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AuditLogViewer />
              </RoleGuard>
            } 
          />

          {/* --- Root Navigation Logic --- */}
          <Route 
            path="/" 
            element={
              user ? (
                user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/warehouse" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}n