import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserIdentity, UserRole } from '../types';

interface AuthContextType {
  user: UserIdentity | null;
  login: (userData: UserIdentity) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserIdentity>) => void;
  isOffline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sentinel_user_identity';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Load from local storage on mount (Local Caching)
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

  const login = (userData: UserIdentity) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (updates: Partial<UserIdentity>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Offline Sync Logic (SMS Handshake Simulation)
    if (isOffline) {
      console.log('[Offline Sync] Queuing profile update for SMS Handshake...');
      const queue = JSON.parse(localStorage.getItem('sentinel_sync_queue') || '[]');
      queue.push({ type: 'PROFILE_UPDATE', data: updates, timestamp: Date.now() });
      localStorage.setItem('sentinel_sync_queue', JSON.stringify(queue));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isOffline }}>
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
