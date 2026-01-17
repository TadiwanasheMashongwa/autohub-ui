import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { toast } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi.js'; // Added .js extension

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
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
      // 1. Call the API (This now points to /api/v1/auth/login)
      const data = await authApi.login({ email, password });

      // 2. Check if MFA is required (Backend dependent)
      if (data.mfa_enabled) {
        return { 
          success: true, 
          mfaRequired: true, 
          tempToken: data.temp_token, // Adjust based on your exact JSON response keys
          email 
        };
      }

      // 3. Success - Store Session
      // Note: Adjust 'access_token' vs 'accessToken' based on your RegisterRequest/Response Java class
      const token = data.access_token || data.accessToken || data.token;
      const refreshToken = data.refresh_token || data.refreshToken;
      
      if (!token) throw new Error("No access token received from server");

      const userData = { email, role: 'ADMIN' }; // You might want to decode the JWT here to get real role
      
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Welcome back, ${email}`, 'success');
      
      return { success: true, mfaRequired: false };

    } catch (error) {
      console.error("Login Failed:", error);
      // The apiClient interceptor usually handles the toast, 
      // but we return false here to stop the UI spinner.
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