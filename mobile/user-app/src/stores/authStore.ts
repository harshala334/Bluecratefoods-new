import { create } from 'zustand';
import { User, AuthResponse } from '../types/user';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Auth Store - Manages authentication state
 */

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  otpLogin: (phone: string, idToken: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response: AuthResponse = await authService.login({ email, password });

      // Save to storage
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  otpLogin: async (phone, idToken) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyOtp(phone, idToken);

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Verification failed',
        isLoading: false,
      });
      throw error;
    }
  },

  googleLogin: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(token);

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Google login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response: AuthResponse = await authService.signup({ name, email, password });

      // Save to storage
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });

      // Check storage
      const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      const user = await storage.getItem<User>(STORAGE_KEYS.USER_DATA);
      const onboardingCompleted = await storage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);

      set({
        user: user || null,
        token: token || null,
        isAuthenticated: !!(token && user),
        hasCompletedOnboarding: !!onboardingCompleted,
        isLoading: false,
      });
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error('Complete onboarding error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
