import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../../context/NotificationContext';
import { authApi } from '../../api/authApi.js'; 

const AuthContext = createContext(null);

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
        return { success: true, mfaRequired: true, tempToken: data.temp_token, email };
      }

      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const rawRole = data.role;
      
      if (!token) throw new Error("Security Error: Access token missing.");

      const role = typeof rawRole === 'string' ? rawRole.replace('ROLE_', '') : 'CUSTOMER';
      const userData = { email: data.username, role };
      
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Access Granted: ${role} Profile`, 'success');
      return { success: true, mfaRequired: false, role };
    } catch (error) {
      console.error("Auth Failure:", error);
      toast.show(error.response?.data?.message || "Login failed", "error");
      return { success: false, error: error.message };
    }
  };

  /**
   * Silicon Valley Grade: Password Recovery Flow
   */
  const requestPasswordReset = async (email) => {
    try {
      await authApi.initiatePasswordReset(email);
      // We return success even if email doesn't exist to prevent account enumeration (security best practice)
      return { success: true };
    } catch (error) {
      console.error("Reset Request Failure:", error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authApi.completePasswordReset(token, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Reset Completion Failure:", error);
      toast.show(error.response?.data?.message || "Failed to update password", "error");
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
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      requestPasswordReset, 
      resetPassword 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);