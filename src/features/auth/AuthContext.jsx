import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../../context/NotificationContext';
import { authApi } from '../../api/authApi.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getProfile(); 
        const role = data.role.replace('ROLE_', '');
        const userData = { email: data.username, role };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  const login = async (email, password) => {
    localStorage.clear(); 
    try {
      const data = await authApi.login({ email, password });

      if (data.accessToken === "MFA_REQUIRED") {
        return { success: true, mfaRequired: true, email };
      }

      if (!data.role) throw new Error("Security Error: Identity role missing.");

      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username, role };
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Authenticated: ${role} Profile`, 'success');
      return { success: true, mfaRequired: false, role };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login Failed";
      toast.show(msg, 'error');
      return { success: false, error: msg };
    }
  };

  /**
   * Silicon Valley Grade: Double-Tap Logout
   * 1. Attempts to notify the backend (POST /logout)
   * 2. Forcefully clears local state regardless of server response
   */
  const logout = async () => {
    try {
      // Direct call to notify backend
      await authApi.logout();
    } catch (error) {
      console.warn("Backend session termination unreachable.");
    } finally {
      // Local wipe always executes
      localStorage.clear();
      setUser(null);
      toast.show("Session Terminated", "success");
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);