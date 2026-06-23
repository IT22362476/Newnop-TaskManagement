/**
 * AuthContext — Manages user authentication state globally.
 * Provides: user, token, loading, error, register, login, logout
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser as apiRegister, loginUser as apiLogin, getMe } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, verify token by fetching current user
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data);
        } catch {
          // Token invalid / expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const register = useCallback(async (name, email, password, adminSecret) => {
    setError(null);
    try {
      const payload = { name, email, password };
      if (adminSecret) payload.adminSecret = adminSecret;
      const { data } = await apiRegister(payload);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(msg);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data } = await apiLogin({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
