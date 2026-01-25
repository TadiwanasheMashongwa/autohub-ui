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
        // Confirm identity with backend
        const data = await authApi.getProfile(); 
        const role = data.role.replace('ROLE_', '');
        const userData = { email: data.username, role };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Silent clear - background validation failed
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

      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username, role };
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Access Granted: ${role} Profile`, 'success');
      return { success: true, mfaRequired: false, role };
    } catch (error) {
      const msg = error.response?.data?.message || "Login Failed";
      toast.show(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);