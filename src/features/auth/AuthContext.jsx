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
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to fetch profile. If 401 occurs, apiClient interceptor 
        // will automatically attempt a refresh before this call fails.
        const data = await authApi.getProfile();
        
        const identifier = data.username || data.email;
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          const userData = { email: identifier, role: cleanRole };
          setUser(userData);
        }
      } catch (error) {
        // If it STILL fails after the apiClient retry logic:
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
      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username || data.email, role };
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setUser(userData);
      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
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