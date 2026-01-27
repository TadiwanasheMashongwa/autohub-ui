import { createContext, useContext, useState, useEffect, useRef } from 'react';
// FIX: Go up two levels (features -> src) to find 'api'
import { authApi } from '../../api/authApi.js'; 
// FIX: Go up two levels (features -> src) to find 'context'
import { toast } from '../../context/NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      initialized.current = true;

      const token = localStorage.getItem('token');
      
      if (!token || token === 'undefined' || token === 'null') {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getProfile();
        const identifier = data.username || data.email;
        // Strip ROLE_ prefix so we just have 'CLERK' or 'ADMIN'
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          setUser({ email: identifier, role: cleanRole });
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      const cleanRole = data.role.replace('ROLE_', '');
      const userData = { email: data.username || data.email, role: cleanRole };
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setUser(userData);
      return { success: true, role: cleanRole };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      const email = user?.email;
      if (email) await authApi.logout(email);
    } finally {
      localStorage.clear();
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);