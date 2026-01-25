import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// --- Auth Components ---
import Login from './features/auth/Login.jsx';
import Register from './features/auth/Register.jsx';
import MFAVerify from './features/auth/MFAVerify.jsx';
import ForgotPassword from './features/auth/ForgotPassword.jsx';
import ResetPassword from './features/auth/ResetPassword.jsx';

// --- Feature Components ---
import PartCatalog from './features/catalog/PartCatalog.jsx';
import CartDrawer from './features/checkout/CartDrawer.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';
import AuditLogViewer from './features/dashboard/AuditLogViewer.jsx';
import OrderManager from './features/dashboard/OrderManager.jsx';

// --- Routing & Security ---
import RoleGuard from './routes/RoleGuard.jsx';

export default function App() {
  const { user, loading } = useAuth();

  // Prevent flicker during session restoration
  if (loading) return null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-dark">
        <CartDrawer />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<div className="text-white p-20 text-center font-black">403 | RESTRICTED</div>} />

          {/* Protected Routes */}
          <Route 
            path="/warehouse/*" 
            element={
              <RoleGuard allowedRoles={['CLERK', 'ADMIN', 'CUSTOMER']}>
                <PartCatalog />
              </RoleGuard>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            } 
          />

          {/* ROOT REDIRECTION LOGIC */}
          <Route 
            path="/" 
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.role === 'ADMIN' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/warehouse" replace />
              )
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}