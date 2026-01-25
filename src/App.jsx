import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

// Components
import Login from './features/auth/Login.jsx';
import Register from './features/auth/Register.jsx';
import PartCatalog from './features/catalog/PartCatalog.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';
import RoleGuard from './routes/RoleGuard.jsx';

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

          {/* Protected */}
          <Route path="/warehouse" element={
            <RoleGuard allowedRoles={['ADMIN', 'CLERK', 'CUSTOMER']}>
              <PartCatalog />
            </RoleGuard>
          } />

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