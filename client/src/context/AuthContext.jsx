import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  // ================= VERIFY TOKEN =================
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('admin_token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');

        setUser(data.data);
        setToken(savedToken);

      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // ================= LOGIN =================
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: userData } = data.data;

      localStorage.setItem('admin_token', newToken);
      localStorage.setItem('admin_user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      toast.success(`Welcome back, ${userData.name}! 🚀`);

      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  // ================= LOGOUT =================
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore logout API error
    }

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    setToken(null);
    setUser(null);

    toast.success('Logged out successfully');
  }, []);

  // ================= AUTH STATUS =================
  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};