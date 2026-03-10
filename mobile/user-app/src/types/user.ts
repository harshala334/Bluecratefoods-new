export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  profileImage?: string;
  backgroundImage?: string;
  isGuest?: boolean;
  userType: 'individual' | 'business' | 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
  activeOrderId?: string;
  subscriptionTier?: 'free' | 'premium' | 'enterprise';
}

export interface Address {
  id: string;
  userId: string;
  label: string; // Home, Work, Other
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType?: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  profileImage?: string;
  backgroundImage?: string;
}
