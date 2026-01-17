import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/authenticate', { email, password });
      
      if (response.data.mfaRequired) {
        return { 
          success: true, 
          mfaRequired: true, 
          tempToken: response.data.tempToken,
          email: email 
        };
      }

      const { accessToken, refreshToken, user: userData } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, mfaRequired: false };
    } catch (error) {
      return { success: false };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await apiClient.post('/auth/password-reset/request', { email });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await apiClient.post('/auth/password-reset/confirm', { token, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, requestPasswordReset, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);