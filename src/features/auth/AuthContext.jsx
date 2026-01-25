import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi.js'; 

const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });

      if (data.mfa_enabled) {
        return { 
          success: true, 
          mfaRequired: true, 
          tempToken: data.temp_token, 
          email 
        };
      }

      const token = data.access_token || data.accessToken || data.token;
      const refreshToken = data.refresh_token || data.refreshToken;
      
      if (!token) throw new Error("No access token received from server");

      const decoded = parseJwt(token);
      
      // Handle the ROLE_ prefix from backend
      const rawRole = decoded?.role || decoded?.roles?.[0] || decoded?.authorities?.[0] || 'CUSTOMER';
      const role = typeof rawRole === 'string' ? rawRole.replace('ROLE_', '') : 'CUSTOMER';

      const userData = { email, role };
      
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Welcome, ${email}`, 'success');
      
      return { success: true, mfaRequired: false, role };

    } catch (error) {
      console.error("Login Failed:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authApi.logout().catch(err => console.warn("Logout notify failed", err));
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