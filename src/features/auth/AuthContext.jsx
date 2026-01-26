import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../../api/authApi.js'; 
import { toast } from '../../context/NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      // Prevent double-execution in React Strict Mode
      if (initialized.current) return;
      initialized.current = true;

      const token = localStorage.getItem('token');
      
      if (!token || token === 'undefined' || token === 'null') {
        setLoading(false);
        return;
      }

      try {
        console.log("AUTH_LOG: Recovering session...");
        
        // This call will be automatically intercepted and retried by apiClient.js
        // if the token is expired. We only catch if the refresh also fails.
        const data = await authApi.getProfile();
        
        const identifier = data.username || data.email;
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          setUser({ email: identifier, role: cleanRole });
          console.log("AUTH_LOG: Identity verified.");
        }
      } catch (error) {
        console.error("AUTH_LOG: Session recovery failed permanently.");
        
        // Only clear if the server explicitly rejected the final attempt
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