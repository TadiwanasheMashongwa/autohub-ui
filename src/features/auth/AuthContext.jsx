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
    // Silicon Valley Grade: Clear stale sessions before a new attempt
    localStorage.clear(); 
    
    try {
      const data = await authApi.login({ email, password });

      // 1. Detect MFA Requirement
      if (data.accessToken === "MFA_REQUIRED") {
        return { success: true, mfaRequired: true, email };
      }

      // 2. Strict Role Extraction
      if (!data.role) {
        throw new Error("Security Error: Identity role not provided by server.");
      }

      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const role = data.role.replace('ROLE_', ''); // Normalize to ADMIN, CUSTOMER, or CLERK
      
      const userData = { email: data.username, role };
      
      // 3. Secure Session Storage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      toast.show(`Operator Authenticated: ${role} Profile`, 'success');
      return { success: true, mfaRequired: false, role };

    } catch (error) {
      console.error("Auth Failure:", error);
      const msg = error.response?.data?.message || error.message || "Authentication Failed";
      toast.show(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const verifyMfaAction = async (email, code) => {
    try {
      const data = await authApi.verifyMfa({ email, code });
      
      if (!data.role) throw new Error("MFA Success but role missing.");

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

  const logout = () => {
    const userEmail = user?.email;
    if (userEmail) authApi.logout(userEmail).catch(() => {});
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading, verifyMfaAction 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);