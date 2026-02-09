import { useAuth } from '../features/auth/AuthContext';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import CustomerDashboard from '../features/dashboard/CustomerDashboard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={48} />
      </div>
    );
  }

  // LOGIC: If role is ADMIN or CLERK, show the Admin/Warehouse Dashboard.
  // AuthContext removes the 'ROLE_' prefix, so we check for just 'CLERK'.
  const isInternalUser = user?.role === 'ADMIN' || user?.role === 'CLERK';

  if (isInternalUser) {
    return <AdminDashboard />;
  }

  // Otherwise, show the standard Customer Dashboard
  return <CustomerDashboard />;
}