import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api/authApi.js'; 
import { toast } from '../../context/NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("AUTH_DEBUG: Attempting re-hydration with token...");
        const data = await authApi.getProfile();
        
        const identifier = data.username || data.email;
        const cleanRole = (data.role || 'CUSTOMER').replace('ROLE_', '');

        if (identifier) {
          const userData = { email: identifier, role: cleanRole };
          setUser(userData);
          console.log("AUTH_DEBUG: Re-hydration successful:", userData);
        }
      } catch (error) {
        // SILICON VALLEY GRADE: Granular Error Handling
        console.error("AUTH_DEBUG: Error during init:", error.response?.status, error.message);
        
        // Only wipe storage if the server explicitly tells us the token is dead
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("AUTH_DEBUG: Token invalid. Clearing session.");
          localStorage.clear();
          setUser(null);
        } else {
          // If it's a network error (server down), don't log the user out!
          console.warn("AUTH_DEBUG: Network error. Retaining local token.");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ... rest of the login/logout code remains the same as your previous version ...
  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      const role = data.role.replace('ROLE_', '');
      const userData = { email: data.username || data.email, role };
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(userData);
      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
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