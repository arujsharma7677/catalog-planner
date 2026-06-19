'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, signup as signupApi } from '@/services/authService';
import { getCredits } from '@/services/creditsService';
import { saveSellerProfile, sellerProfileFromUser } from '@/lib/seller-profile';
import type { SignupData, UserProfile } from '@/services/authService';

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  userId: string | null;
  credits: number | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    const userStored = localStorage.getItem('auth_user');
    const userIdStored = localStorage.getItem('user_id');
    if (stored && userStored) {
      setToken(stored);
      setUser(JSON.parse(userStored));
      setUserId(userIdStored);
      refreshCredits();
    }
    setIsLoading(false);
  }, []);

  const refreshCredits = async () => {
    try {
      const creditsData = await getCredits();
      setCredits(creditsData.credits_balance);
    } catch (err) {
      console.error('Failed to refresh credits', err);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      setToken(data.access_token);
      setUser(data.user);
      setUserId(data.user_id);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user_id);
      document.cookie = `auth_token=${data.access_token};path=/;max-age=86400`;
      // Seed the seller profile from the logged-in user so the auto-fill form
      // (brand, country of origin, manufacturer/packer/importer addresses) is prefilled.
      if (data.user) {
        saveSellerProfile(sellerProfileFromUser(data.user));
      }
      await refreshCredits();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      await signupApi(data);
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserId(null);
    setCredits(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user_id');
    document.cookie = 'auth_token=;path=/;max-age=0';
  };

  return (
    <AuthContext.Provider value={{ token, user, userId, credits, login, signup, logout, isLoading, refreshCredits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
