import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

// To support deep linking and standard web URLs
const prefix = Linking.createURL('/');

export const linkingConfig: LinkingOptions<any> = {
  prefixes: [prefix, 'http://app.bluecratefoods.com', 'https://app.bluecratefoods.com'],
  config: {
    initialRouteName: 'Main',
    screens: {
      Onboarding: {
        screens: {
          Welcome: 'welcome',
          AuthMethod: 'auth-method',
          OTP: 'otp',
          Terms: 'terms',
          ProfileSetup: 'profile-setup',
          LocationPermission: 'location-permission',
        }
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: '',
              InvisiblePartner: 'partner',
              WholesaleForm: 'wholesale',
            }
          },
          ProductsTab: {
            screens: {
              ProductList: 'products',
              CategoryDetail: 'category/:id',
              ProductDetail: 'product/:id',
              RecipeDetail: 'recipe/:id',
            }
          },
          OffersTab: 'offers',
          CartTab: {
            screens: {
              CartMain: 'cart',
              Checkout: 'checkout',
            }
          },
          AdvsTab: 'promotions',
        }
      },
      Profile: 'profile',
      EditProfile: 'profile/edit',
      Location: 'location',
      Login: 'login',
      Register: 'register',
      Chat: 'chat',
      TrackOrder: 'track-order',
      MyOrders: 'orders',
      Subscription: 'subscription',
      Favorites: 'favorites',
      ManageAddresses: 'addresses',
      DietaryPreferences: 'dietary-preferences',
      Payments: 'payments',
      NotificationSettings: 'notifications',
      PrivacySecurity: 'privacy',
      HelpCenter: 'help',
    }
  }
};
