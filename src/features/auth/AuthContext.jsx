import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../../context/NotificationContext';
import { authApi } from '../../api/authApi.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync state with localStorage on mount
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

      // Handle MFA scenario if enabled on backend
      if (data.mfa_enabled) {
        return { success: true, mfaRequired: true, tempToken: data.temp_token, email };
      }

      // Extracts from AuthenticationResponse.java
      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const rawRole = data.role; // Now coming directly from DTO
      
      if (!token) throw new Error("Security Error: Access token missing from response.");

      // Normalize role (remove ROLE_ prefix)
      const role = typeof rawRole === 'string' ? rawRole.replace('ROLE_', '') : 'CUSTOMER';

      const userData = { email: data.username, role };
      
      // Persist session
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Access Granted: ${role} Profile`, 'success');
      
      return { success: true, mfaRequired: false, role };

    } catch (error) {
      console.error("Auth Failure:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authApi.logout().catch(() => console.warn("Session termination notify failed."));
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