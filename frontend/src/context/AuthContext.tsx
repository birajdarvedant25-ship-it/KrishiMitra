import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken } from '../services/api.js';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  preferredLanguage: 'en' | 'hi' | 'mr';
  state: string;
  district: string;
  village?: string;
  onboardingCompleted: boolean;
}

export interface FarmerProfile {
  farmSizeAcres?: number;
  soilType?: string;
  irrigationMethod?: string;
  experienceYears?: number;
}

interface AuthContextType {
  user: User | null;
  profile: FarmerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { emailOrPhone: string; password: string }) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      } else {
        setStoredToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch {
      setStoredToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { emailOrPhone: string; password: string }) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.token) {
      setStoredToken(res.token);
      setUser(res.user);
      await refreshUser();
    }
  };

  const register = async (details: any) => {
    const res = await api.auth.register(details);
    if (res.success && res.token) {
      setStoredToken(res.token);
      setUser(res.user);
      await refreshUser();
    }
  };

  const completeOnboarding = async (data: any) => {
    const res = await api.auth.onboarding(data);
    if (res.success) {
      setUser(res.user);
      await refreshUser();
    }
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        completeOnboarding
      }}
    >
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
