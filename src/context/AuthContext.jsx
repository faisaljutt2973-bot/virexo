import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
      } catch (error) {
        console.error('Failed to parse user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const userData = response.data.user;
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.user;
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
