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

// Recipe Stack
export type RecipeStackParamList = {
  RecipeList: {
    timeCategory?: string;
    initialSearch?: string;
  };
  RecipeDetail: {
    recipeId: string;
  };
  CookingGuide: {
    recipeId: string;
    recipeName: string;
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
  Home: NavigatorScreenParams<HomeStackParamList>;
  RecipesTab: NavigatorScreenParams<RecipeStackParamList>;
  Cart: NavigatorScreenParams<CartStackParamList>;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Chat: {
    initialQuery?: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
