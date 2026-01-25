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
      if (token) {
        try {
          const data = await authApi.getProfile();
          setUser({ email: data.username, role: data.role.replace('ROLE_', '') });
        } catch {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username, role };
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout(); // Backend endpoint POST /auth/logout
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