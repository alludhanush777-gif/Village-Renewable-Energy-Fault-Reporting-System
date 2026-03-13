import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserIdentity, UserRole } from '../types';

interface AuthContextType {
  user: UserIdentity | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserIdentity>) => void;
  isOffline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sentinel_user_identity';
const TOKEN_KEY = 'sentinel_auth_token';
const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Sentinel Authenticated Locally (Demo Mode)");
      const userData: UserIdentity = { 
        uid: 'SNTNL-001',
        fullName: "Dhanush Allu", 
        role: "Lead Commander" as UserRole,
        village: "Sentinel HQ", 
        district: "Southern Rift",
        phone: "555-0199", 
        email,
        trustScore: 100,
        credits: 500,
        status: 'online'
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, 'demo_token_123');
    } catch (err) {
      console.error('Login Failure:', err);
      throw err;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log("Sentinel Registered Locally (Demo Mode)");
      const user: UserIdentity = { 
        ...userData, 
        uid: `SNTNL-${Math.floor(Math.random() * 1000)}`,
        fullName: userData.name, 
        role: userData.role || 'REPORTER' as UserRole,
        district: "Southern Rift",
        trustScore: 100,
        credits: 0,
        status: 'online'
      };
      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, 'demo_token_456');
    } catch (err) {
      console.error('Registration Failure:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = (updates: Partial<UserIdentity>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isOffline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
