import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../../context/NotificationContext';
import { authApi } from '../../api/authApi.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      // Strict check: Only restore session if BOTH user and token exist
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.clear(); // Wipe corrupt data
        }
      } else {
        // Force clear to ensure no partial data causes "Ghost Login"
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    localStorage.clear(); 
    try {
      const data = await authApi.login({ email, password });

      if (data.accessToken === "MFA_REQUIRED") {
        return { success: true, mfaRequired: true, email };
      }

      if (!data.role) {
        throw new Error("Security Error: Identity role missing.");
      }

      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username, role };
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
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

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
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