import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import { Loader2 } from 'lucide-react';

// Components
import Login from './features/auth/Login.jsx';
import Register from './features/auth/Register.jsx';
import PartCatalog from './features/catalog/PartCatalog.jsx';
import PartDetail from './features/catalog/PartDetail.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';
import RoleGuard from './routes/RoleGuard.jsx';

// CHECKLIST Step 3
import CartPage from './features/checkout/CartPage.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';
import CartDrawer from './features/checkout/CartDrawer.jsx'; 

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em]">
          Re-Establishing Secure Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {user && <Sidebar />}

      <main className={`flex-1 transition-all ${user ? 'ml-64' : ''}`}>
        {user && <CartDrawer />}

        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

          <Route path="/warehouse" element={
            <RoleGuard allowedRoles={['ADMIN', 'CLERK', 'CUSTOMER']}>
              <PartCatalog />
            </RoleGuard>
          } />

          <Route path="/warehouse/parts/:id" element={
            <RoleGuard allowedRoles={['ADMIN', 'CLERK', 'CUSTOMER']}>
              <PartDetail />
            </RoleGuard>
          } />

          <Route path="/cart" element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <CartPage />
            </RoleGuard>
          } />

          <Route path="/checkout" element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <CheckoutPage />
            </RoleGuard>
          } />

          <Route path="/admin" element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />

          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> : 
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/warehouse" replace />
          } />
        </Routes>
      </main>
    </div>
  );
}