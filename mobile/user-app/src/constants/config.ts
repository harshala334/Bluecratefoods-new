import { Platform } from 'react-native';

// API Configuration
// API Configuration
export const PROD_URL = 'https://api-gateway-441546178642.us-central1.run.app/api';
// Use LAN IP for Android to support both Emulator and Real Device (via Expo Tunnel)
// NOTE: 10.0.2.2 is used for Android Emulator to access host machine localhost
export const LOCAL_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api';
export const CDN_URL = 'https://storage.googleapis.com/bluecrate-assets';

// Helper to decide base URL per endpoint
const getBaseUrl = () => {
  return PROD_URL; // Point to production Cloud Run
};

const baseUrl = getBaseUrl();

export const API_CONFIG = {
  BASE_URL: baseUrl,

  TIMEOUT: 30000, // 30 seconds

  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: `${baseUrl}/auth/login`,
    SIGNUP: `${baseUrl}/auth/signup`,
    LOGOUT: `${baseUrl}/auth/logout`,
    REFRESH_TOKEN: `${baseUrl}/auth/refresh-token`,
    FORGOT_PASSWORD: `${baseUrl}/auth/forgot-password`,
    USER_PROFILE: `${baseUrl}/auth/profile`,
    UPDATE_PROFILE: `${baseUrl}/auth/profile`,

    // Recipes/Products - Consolidated to products prefix
    RECIPES: `${baseUrl}/products`,
    RECIPE_DETAIL: (id: string) => `${baseUrl}/products/${id}`,
    RECIPE_CATEGORIES: `${baseUrl}/products/categories`,
    RECIPE_SEARCH: `${baseUrl}/products`, // Service should use search param here
    ADMIN_ALL_RECIPES: `${baseUrl}/products`,
    PENDING_RECIPES: `${baseUrl}/products`,
    APPROVE_RECIPE: (id: string) => `${baseUrl}/products/${id}/approve`,
    REJECT_RECIPE: (id: string) => `${baseUrl}/products/${id}/reject`,
    REJECT_BY_AUTHOR: (authorId: string) => `${baseUrl}/products/reject-by-author/${authorId}`,

    // Cart - Use Prod
    CART: `${baseUrl}/cart`,
    ADD_TO_CART: `${baseUrl}/cart/add`,
    UPDATE_CART: `${baseUrl}/cart/update`,
    REMOVE_FROM_CART: `${baseUrl}/cart/remove`,
    CLEAR_CART: `${baseUrl}/cart/clear`,

    // Orders - Use Prod (Gateway)
    ORDERS: `${baseUrl}/orders`, // Note: Gateway requires trailing slash for root sometimes, but app logic should handle paths
    ORDER_DETAIL: (id: string) => `${baseUrl}/orders/${id}`,
    CREATE_ORDER: `${baseUrl}/orders/`,
    ORDERS_MINE: `${baseUrl}/orders/mine`,
    ORDERS_STORE: (storeId: string) => `${baseUrl}/orders/store/${storeId}`,
    UPDATE_STATUS: (id: string) => `${baseUrl}/orders/${id}/status`,
    TRACK_ORDER: (id: string) => `${baseUrl}/orders/${id}/track`,

    // Payment
    CREATE_PAYMENT: `${baseUrl}/payments/create`,
    VERIFY_PAYMENT: `${baseUrl}/payments/verify`,

    // Location (Google Maps Proxy)
    LOCATION: `${baseUrl}/location`, // Base URL for GooglePlacesAutocomplete
    REVERSE_GEOCODE: `${baseUrl}/location/reverse-geocode`,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@bluecrate:auth_token',
  REFRESH_TOKEN: '@bluecrate:refresh_token',
  USER_DATA: '@bluecrate:user_data',
  CART_DATA: '@bluecrate:cart_data',
  RECENT_SEARCHES: '@bluecrate:recent_searches',
  ONBOARDING_COMPLETE: '@bluecrate:onboarding_complete',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Blue Crate',
  TAGLINE: 'Ready-to-Cook. Ready-to-Love.',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'connect@bluecratefoods.com',
  SUPPORT_PHONE: '+91 9591890828',

  // Feature Flags
  FEATURES: {
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_BIOMETRIC_AUTH: true,
    ENABLE_SOCIAL_LOGIN: false,
    ENABLE_RECIPE_VIDEOS: true,
  },

  // Pagination
  ITEMS_PER_PAGE: 20,

  // Map
  MAP: {
    DEFAULT_LATITUDE: 37.7749,
    DEFAULT_LONGITUDE: -122.4194,
    DEFAULT_ZOOM: 15,
  },
};

// Time Constants
export const TIME_CONSTANTS = {
  CATEGORIES: [
    { id: '1min', label: '< 1 Minute', value: 1 },
    { id: '10min', label: '< 10 Minutes', value: 10 },
    { id: '1hour', label: '< 1 Hour', value: 60 },
  ],
  REFRESH_INTERVAL: 5000, // 5 seconds for order tracking
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export default {
  API_CONFIG,
  STORAGE_KEYS,
  APP_CONFIG,
  TIME_CONSTANTS,
  DIFFICULTY_LEVELS,
};
