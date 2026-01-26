import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

// Components
import Login from './features/auth/Login.jsx';
import Register from './features/auth/Register.jsx';
import PartCatalog from './features/catalog/PartCatalog.jsx';
import PartDetail from './features/catalog/PartDetail.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';
import RoleGuard from './routes/RoleGuard.jsx';

// CHECKLIST Step 3: Import Cart & Checkout Components
import CartPage from './features/checkout/CartPage.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar only appears if a user is logged in */}
      {user && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 transition-all ${user ? 'ml-64' : ''}`}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

          {/* Protected Catalog */}
          <Route path="/warehouse" element={
            <RoleGuard allowedRoles={['ADMIN', 'CLERK', 'CUSTOMER']}>
              <PartCatalog />
            </RoleGuard>
          } />

          {/* STEP 04: Part Technical Spec View */}
          <Route path="/warehouse/parts/:id" element={
            <RoleGuard allowedRoles={['ADMIN', 'CLERK', 'CUSTOMER']}>
              <PartDetail />
            </RoleGuard>
          } />

          {/* CHECKLIST Step 3: Shopping Cart & Checkout Routes */}
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

          {/* Admin Protected */}
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />

          {/* Root Logic */}
          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> : 
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/warehouse" replace />
          } />
        </Routes>
      </main>
    </div>
  );
}