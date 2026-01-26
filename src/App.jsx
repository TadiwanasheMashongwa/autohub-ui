import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import { Loader2 } from 'lucide-react';

// Authentication & Identity
import Login from './features/auth/Login.jsx';
import Register from './features/auth/Register.jsx';
import RoleGuard from './routes/RoleGuard.jsx';

// Catalog & Warehouse
import PartCatalog from './features/catalog/PartCatalog.jsx';
import PartDetail from './features/catalog/PartDetail.jsx';

// Checkout & Transaction Flow
import CartPage from './features/checkout/CartPage.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';
import CartDrawer from './features/checkout/CartDrawer.jsx';

// Orders & Post-Purchase UX
import OrderHistory from './features/orders/OrderHistory.jsx';
import OrderSuccess from './features/orders/OrderSuccess.jsx';

// Dashboards
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';

export default function App() {
  const { user, loading } = useAuth();

  // SILICON VALLEY GRADE: Session Re-hydration UI
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
      {/* Sidebar only appears if a user is logged in */}
      {user && <Sidebar />}

      <main className={`flex-1 transition-all ${user ? 'ml-64' : ''}`}>
        
        {/* Global Cart Utility */}
        {user && <CartDrawer />}

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

          {/* Protected Warehouse & Catalog */}
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

          {/* Transaction & Settlement Routes */}
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

          {/* Orders & Success Manifests */}
          <Route path="/orders" element={
            <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
              <OrderHistory />
            </RoleGuard>
          } />

          <Route path="/dashboard/orders/success" element={
            <RoleGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
              <OrderSuccess />
            </RoleGuard>
          } />

          {/* Administrative Terminal */}
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />

          {/* Root Identity Logic */}
          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> : 
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/warehouse" replace />
          } />
          
          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}