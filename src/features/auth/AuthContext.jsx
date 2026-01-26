import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api/authApi.js'; 
import { toast } from '../../context/NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      
      // If no token exists at all, just stop loading and show login
      if (!token || token === 'undefined' || token === 'null') {
        setLoading(false);
        return;
      }

      try {
        // Attempt to fetch profile. 
        // Our apiClient interceptor will handle the 401/Refresh logic automatically.
        const data = await authApi.getProfile();
        
        const identifier = data.username || data.email;
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          const userData = { email: identifier, role: cleanRole };
          setUser(userData);
        }
      } catch (error) {
        // SILICON VALLEY GRADE: Only wipe if it's a definitive security failure
        // If it's a network error (server down), we keep the token and stay on the page.
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Session expired or invalid. Terminating local state.");
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
      localStorage.setItem('user', JSON.stringify(userData));
      
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