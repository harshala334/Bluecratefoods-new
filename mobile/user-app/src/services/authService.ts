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
    console.log('[MOCK] Sending OTP to:', phone);
    // Mock success
    return { success: true, message: 'OTP sent successfully (MOCK)' };
    // return api.post<{ success: boolean; message: string }>(`${API_CONFIG.BASE_URL}/auth/send-otp`, { phone });
  },

  async verifyOtp(phone: string, code: string): Promise<AuthResponse> {
    console.log('[MOCK] Verifying OTP:', code, 'for phone:', phone);
    
    // Mock user response
    const now = new Date().toISOString();
    if (code === '1234' || code === '0000') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: { 
          id: 'mock-user-' + phone, 
          name: 'Verified User', 
          email: `${phone}@example.com`,
          phone: phone,
          userType: 'customer', 
          createdAt: now, 
          updatedAt: now 
        }
      };
    }
    
    // If we want to hit real API later:
    // return api.post<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/verify-otp`, { phone, code });
    throw new Error('Invalid OTP. Please use 1234 or 0000 for mock login.');
  },

  // Google Login
  async googleLogin(token: string): Promise<AuthResponse> {
    console.log('[MOCK] Performing Google Login with token:', token);
    const now = new Date().toISOString();
    return {
      token: 'mock-google-jwt-token-' + Date.now(),
      user: { 
        id: 'mock-google-id', 
        name: 'Google User', 
        email: 'google.user@example.com', 
        userType: 'customer', 
        createdAt: now, 
        updatedAt: now 
      }
    };
  },
};

export default authService;
