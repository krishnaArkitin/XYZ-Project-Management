
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../api'; // Use the new API utility

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// NOTE: mockProjects has been removed as all data will now come from the backend.


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const { data } = await api.get('/auth/me');
          setUser(data); 
        } catch (error) {
          console.error('Failed to authenticate token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data); 
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    }
  };
  
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, role });
      localStorage.setItem('token', data.token);
      setUser(data); 
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-slate-700">Loading authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
