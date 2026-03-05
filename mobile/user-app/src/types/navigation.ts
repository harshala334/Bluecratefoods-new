import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Home Stack
export type HomeStackParamList = {
  HomeMain: undefined;
  CategoryRecipes: {
    categoryId: string;
    categoryName: string;
  };
};

// Product Stack
export type ProductStackParamList = {
  ProductList: {
    initialSearch?: string;
  };
  CategoryDetail: {
    categoryId: string;
    categoryTitle: string;
    subCategoryId?: string;
  };
  ProductDetail: {
    product: any; // Ideally this should be Recipe or Product type
    productId?: string;
  };
};

// Cart Stack
export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  OrderSuccess: {
    orderId: string;
  };
};

// Orders Stack
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: {
    orderId: string;
  };
  OrderTracking: {
    orderId: string;
  };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: undefined;
  Settings: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
  HomeTab: undefined;
  ProductsTab: NavigatorScreenParams<ProductStackParamList>;
  MissionsTab: undefined;
  CommunityTab: undefined;
  CartTab: NavigatorScreenParams<CartStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Chat: {
    initialQuery?: string;
  };
  EditProfile: undefined;
  Location: undefined;
  Profile: undefined;
  TrackOrder: {
    orderId: string;
  };
  MyOrders: undefined;
  AdminRequests: undefined;
  CreatorApplication: undefined;
  Login: undefined;
  Register: undefined;
  Subscription: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
