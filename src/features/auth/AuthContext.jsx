import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../../api/authApi.js'; 
import { toast } from '../../context/NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false); // Prevents double-init in Strict Mode

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
        console.log("AUTH_LOG: Initializing session...");
        const data = await authApi.getProfile();
        
        const identifier = data.username || data.email;
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          const userData = { email: identifier, role: cleanRole };
          setUser(userData);
          console.log("AUTH_LOG: Session restored for:", identifier);
        }
      } catch (error) {
        console.error("AUTH_LOG: Initialization error:", error.response?.status, error.message);
        
        // SILICON VALLEY GRADE: Granular Recovery
        // We ONLY wipe storage if the backend explicitly says the token is revoked (401/403)
        // If it's a 400, 500, or Network error, we KEEP the token so the user can try again
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("AUTH_LOG: Session revoked by server. Clearing storage.");
          localStorage.clear();
          setUser(null);
        } else {
          console.warn("AUTH_LOG: Temporary error. Retaining session for retry.");
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