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
  // Create application
  async applyCreator(userId: string, reason?: string, socialLinks?: string[]): Promise<{ success: boolean; message: string }> {
    return api.patch<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.APPLY_CREATOR, { userId, reason, socialLinks });
  },

  // Admin: Get pending creators
  async getPendingCreators(): Promise<User[]> {
    return api.get<User[]>(API_CONFIG.ENDPOINTS.PENDING_CREATORS);
  },

  // Admin: Approve creator
  async approveCreator(userId: string): Promise<{ success: boolean; message: string }> {
    return api.patch<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.APPROVE_CREATOR(userId), {});
  },

  // Admin: Reject creator
  async rejectCreator(userId: string): Promise<{ success: boolean; message: string }> {
    return api.patch<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.REJECT_CREATOR(userId), {});
  },

  // Admin: Get all verified creators
  async getVerifiedCreators(): Promise<User[]> {
    return api.get<User[]>(API_CONFIG.ENDPOINTS.VERIFIED_CREATORS);
  },

  // Admin: Revoke creator status
  async revokeCreator(userId: string): Promise<any> {
    return api.patch(API_CONFIG.ENDPOINTS.REVOKE_CREATOR(userId), {});
  },

  // OTP Login
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>(`${API_CONFIG.BASE_URL}/auth/send-otp`, { phone });
  },

  async verifyOtp(phone: string, code: string): Promise<AuthResponse> {
    return api.post<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/verify-otp`, { phone, code });
  },

  // Google Login
  async googleLogin(token: string): Promise<AuthResponse> {
    return api.post<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/google-login`, { token });
  },
};

export default authService;
