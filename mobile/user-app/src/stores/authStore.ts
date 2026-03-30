import { create } from 'zustand';
import { User, AuthResponse, Address } from '../types/user';
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
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
  addresses: Address[];
  selectedAddress: Address | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  otpLogin: (phone: string, idToken: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Promise<void>;
  setSelectedAddress: (address: Address) => void;
  completeOnboarding: () => Promise<void>;
  skipLogin: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  hasCompletedOnboarding: false,
  isLoading: false,
  error: null,
  addresses: [],
  selectedAddress: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response: AuthResponse = await authService.login({ email, password });

      // Save to storage
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
      await storage.setItem(STORAGE_KEYS.IS_GUEST, false);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isGuest: false,
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
      await storage.setItem(STORAGE_KEYS.IS_GUEST, false);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isGuest: false,
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
      await storage.setItem(STORAGE_KEYS.IS_GUEST, false);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isGuest: false,
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
      await storage.setItem(STORAGE_KEYS.IS_GUEST, false);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isGuest: false,
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
      await storage.removeItem(STORAGE_KEYS.IS_GUEST);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isGuest: false,
        hasCompletedOnboarding: true, // Keep this true to avoid redirecting back to Welcome after logout
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
      const isGuest = await storage.getItem<boolean>(STORAGE_KEYS.IS_GUEST) || false;

      set({
        user: user || null,
        token: token || null,
        isAuthenticated: !!(token && user && !isGuest),
        isGuest: isGuest,
        hasCompletedOnboarding: !!onboardingCompleted,
        isLoading: false,
      });

      if (user && !isGuest) {
        // Fetch addresses from a utility or directly
        const { fetchAddresses } = useAuthStore.getState();
        fetchAddresses();
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  fetchAddresses: async () => {
    try {
      const { user, isGuest } = useAuthStore.getState();
      if (!user || isGuest) return;

      // Import service dynamically or at top
      const { addressService } = await import('../services/addressService');
      const addresses = await addressService.getAddresses(user.id);
      set({
        addresses,
        selectedAddress: addresses.find(a => a.isPrimary) || addresses[0] || null
      });
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  },

  addAddress: async (addressData) => {
    try {
      const { user, isGuest } = useAuthStore.getState();
      if (!user || isGuest) return;

      const { addressService } = await import('../services/addressService');
      const newAddress = await addressService.addAddress(user.id, {
        ...addressData,
        userId: user.id,
        isDefault: useAuthStore.getState().addresses.length === 0
      } as any);

      set(state => ({
        addresses: [...state.addresses, newAddress as any],
        selectedAddress: newAddress as any
      }));
    } catch (error) {
      console.error('Add address error:', error);
      throw error;
    }
  },

  setSelectedAddress: (address) => set({ selectedAddress: address }),

  completeOnboarding: async () => {
    try {
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error('Complete onboarding error:', error);
    }
  },

  skipLogin: async () => {
    try {
      set({ isLoading: true });
      const now = new Date().toISOString();
      const mockUser: User = {
        id: 'skip-id',
        name: 'Guest User',
        email: 'guest@example.com',
        userType: 'customer',
        createdAt: now,
        updatedAt: now,
      };
      const mockToken = 'skip-jwt-token';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
      await storage.setItem(STORAGE_KEYS.USER_DATA, mockUser);
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
      await storage.setItem(STORAGE_KEYS.IS_GUEST, true);

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: false,
        isGuest: true,
        hasCompletedOnboarding: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Skip login error:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
