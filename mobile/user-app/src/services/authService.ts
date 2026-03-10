import { api } from './api';
import { API_CONFIG } from '../constants/config';
import { AuthResponse, LoginCredentials, SignupData, User, UpdateProfileData } from '../types/user';

/**
 * Authentication Service
 */

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
  },

  // Signup
  async signup(data: SignupData): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_CONFIG.ENDPOINTS.SIGNUP, data);
  },

  // Logout
  async logout(): Promise<void> {
    return api.post<void>(API_CONFIG.ENDPOINTS.LOGOUT);
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return api.post<{ accessToken: string }>(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
  },

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    return api.get<User>(API_CONFIG.ENDPOINTS.USER_PROFILE);
  },

  // Update profile
  async updateProfile(userId: string, data: UpdateProfileData): Promise<AuthResponse> {
    return api.patch<AuthResponse>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, { userId, ...data });
  },

  // Upload image
  async uploadImage(uri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'upload.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await api.post<{ success: boolean; url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.success && response.url) {
      // If the URL is relative, prepend the base URL
      if (response.url.startsWith('/')) {
        // Explicitly use the domain root for static files (remove /api suffix safely)
        const apiBase = API_CONFIG.BASE_URL;
        // If BASE_URL ends with /api, remove it. Otherwise use as is if it's just domain.
        const baseUrl = apiBase.endsWith('/api')
          ? apiBase.slice(0, -4)
          : apiBase;

        return `${baseUrl}${response.url}`;
      }
      return response.url;
    }
    throw new Error('Upload failed');
  },

  // OTP Login
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>(`${API_CONFIG.BASE_URL}/auth/send-otp`, { phone });
  },

  async verifyOtp(phone: string, code: string): Promise<AuthResponse> {
    // Bypass for Expo Go mocking
    if (code === 'mock-firebase-id-token') {
      console.log('[MOCK] Bypassing verifyOtp API for mock token');
      const now = new Date().toISOString();
      return {
        token: 'mock-jwt-token',
        user: { id: 'mock-id', name: 'Demo User', phone, email: 'demo@example.com', userType: 'customer', createdAt: now, updatedAt: now }
      };
    }
    return api.post<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/verify-otp`, { phone, code });
  },

  // Google Login
  async googleLogin(token: string): Promise<AuthResponse> {
    // Bypass for Expo Go mocking
    if (token === 'mock-google-id-token') {
      console.log('[MOCK] Bypassing googleLogin API for mock token');
      const now = new Date().toISOString();
      return {
        token: 'mock-jwt-token',
        user: { id: 'mock-id', name: 'Demo User', email: 'demo@example.com', userType: 'customer', createdAt: now, updatedAt: now }
      };
    }
    return api.post<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/google-login`, { token });
  },
};

export default authService;
