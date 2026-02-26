import { Platform } from 'react-native';

// API Configuration
// API Configuration
export const PROD_URL = 'https://api.bluecratefoods.com/api';
// Use LAN IP for Android to support both Emulator and Real Device (via Expo Tunnel)
export const LOCAL_URL = Platform.OS === 'android' ? 'http://192.168.31.31:8003' : 'http://localhost:8003';
export const CDN_URL = 'https://storage.googleapis.com/bluecrate-assets';

// Helper to decide base URL per endpoint
const getBaseUrl = (endpoint: string) => {
  // If it's an Order endpoint, use LOCAL
  if (endpoint.includes('/orders') || endpoint.includes('/cart')) {
    return LOCAL_URL;
  }
  // Otherwise (Recipes, etc) use PROD
  return PROD_URL;
};

export const API_CONFIG = {
  // We won't use a single BASE_URL anymore directly in the app, but if we have to:
  // Let's keep BASE_URL as PROD for safety, but we need to patch the service to choose.
  // Actually, providing full URLs in ENDPOINTS is safer if we want mixed mode.
  BASE_URL: PROD_URL,

  TIMEOUT: 30000, // 30 seconds

  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: `${PROD_URL}/auth/login`,
    SIGNUP: `${PROD_URL}/auth/signup`,
    LOGOUT: `${PROD_URL}/auth/logout`,
    REFRESH_TOKEN: `${PROD_URL}/auth/refresh-token`,
    FORGOT_PASSWORD: `${PROD_URL}/auth/forgot-password`,
    USER_PROFILE: `${PROD_URL}/auth/profile`,
    UPDATE_PROFILE: `${PROD_URL}/auth/profile`,
    APPLY_CREATOR: `${PROD_URL}/auth/apply-creator`,
    PENDING_CREATORS: `${PROD_URL}/auth/admin/pending-creators`,
    APPROVE_CREATOR: (id: string) => `${PROD_URL}/auth/admin/approve-creator/${id}`,
    REJECT_CREATOR: (id: string) => `${PROD_URL}/auth/admin/reject-creator/${id}`,
    VERIFIED_CREATORS: `${PROD_URL}/auth/admin/verified-creators`,
    REVOKE_CREATOR: (id: string) => `${PROD_URL}/auth/admin/revoke-creator/${id}`,

    // Recipes - Use Default (Prod)
    RECIPES: `${PROD_URL}/recipes`,
    ADMIN_ALL_RECIPES: `${PROD_URL}/recipes/admin/all`,
    RECIPE_DETAIL: (id: string) => `${PROD_URL}/recipes/${id}`,
    RECIPE_CATEGORIES: `${PROD_URL}/recipes/categories`,
    RECIPE_SEARCH: `${PROD_URL}/recipes/search`,
    PENDING_RECIPES: `${PROD_URL}/recipes/admin/pending`,
    APPROVE_RECIPE: (id: string) => `${PROD_URL}/recipes/admin/${id}/approve`,
    REJECT_RECIPE: (id: string) => `${PROD_URL}/recipes/admin/${id}/reject`,
    REJECT_BY_AUTHOR: (authorId: string) => `${PROD_URL}/recipes/admin/reject-by-author/${authorId}`,

    // Cart - Use Prod
    CART: `${PROD_URL}/cart`,
    ADD_TO_CART: `${PROD_URL}/cart/add`,
    UPDATE_CART: `${PROD_URL}/cart/update`,
    REMOVE_FROM_CART: `${PROD_URL}/cart/remove`,
    CLEAR_CART: `${PROD_URL}/cart/clear`,

    // Orders - Use Prod (Gateway)
    ORDERS: `${PROD_URL}/orders`, // Note: Gateway requires trailing slash for root sometimes, but app logic should handle paths
    ORDER_DETAIL: (id: string) => `${PROD_URL}/orders/${id}`,
    CREATE_ORDER: `${PROD_URL}/orders/`,
    ORDERS_MINE: `${PROD_URL}/orders/mine`,
    ORDERS_STORE: (storeId: string) => `${PROD_URL}/orders/store/${storeId}`,
    UPDATE_STATUS: (id: string) => `${PROD_URL}/orders/${id}/status`,
    TRACK_ORDER: (id: string) => `${PROD_URL}/orders/${id}/track`,

    // Payment
    CREATE_PAYMENT: `${PROD_URL}/payments/create`,
    VERIFY_PAYMENT: `${PROD_URL}/payments/verify`,

    // Location (Google Maps Proxy)
    LOCATION: `${PROD_URL}/location`, // Base URL for GooglePlacesAutocomplete
    REVERSE_GEOCODE: `${PROD_URL}/location/reverse-geocode`,
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
  APP_NAME: 'BlueCrateFoods',
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
