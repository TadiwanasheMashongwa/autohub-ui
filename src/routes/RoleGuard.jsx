import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

/**
 * RoleGuard Component
 * Protects routes based on user authentication and specific roles.
 * * @param {ReactNode} children - The component to render if authorized
 * @param {Array<string>} allowedRoles - List of roles permitted (e.g., ['ADMIN', 'CLERK'])
 */
export default function RoleGuard({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle the "Wait" state while AuthContext checks localStorage/API
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent"></div>
          <p className="text-slate-400 font-mono animate-pulse text-xs tracking-widest uppercase">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  // 2. If no user is logged in, redirect to Login
  // We save 'location' so we can send them back where they were after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check if the user's role matches the required roles for this route
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized - render the protected content
  return children;
}