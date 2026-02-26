import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { Feather } from '@expo/vector-icons';
import LogoHeader from '../components/common/LogoHeader';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import InvisiblePartnerScreen from '../screens/home/InvisiblePartnerScreen';
import WholesaleFormScreen from '../screens/wholesale/WholesaleFormScreen';
import RecipeListScreen from '../screens/recipes/RecipeListScreen';
import AddRecipeScreen from '../screens/recipes/AddRecipeScreen';
import RecipeDetailScreen from '../../src/screens/recipes/RecipeDetailScreen';
import CartScreen from '../../src/screens/cart/CartScreen';
import CheckoutScreen from '../../src/screens/cart/CheckoutScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';
import EditProfileScreen from '../../src/screens/profile/EditProfileScreen';
import LocationScreen from '../../src/screens/location/LocationScreen';
import LocationHeader from '../components/common/LocationHeader';
import ComingSoonScreen from '../screens/common/ComingSoonScreen';
import GoalsScreen from '../screens/goals/GoalsScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import TrackOrderScreen from '../screens/orders/TrackOrderScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import AdminRequestsScreen from '../screens/profile/AdminRequestsScreen';
import CreatorApplicationScreen from '../screens/profile/CreatorApplicationScreen';
import RecipeSimulationScreen from '../screens/simulation/RecipeSimulationScreen';
import { Ionicons } from '@expo/vector-icons';

// Onboarding Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AuthMethodScreen from '../screens/onboarding/AuthMethodScreen';
import OTPScreen from '../screens/onboarding/OTPScreen';
import TermsScreen from '../screens/onboarding/TermsScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';
import useAuthStore from '../stores/authStore';
import { useLocationStore } from '../stores/locationStore';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Home Stack Navigator
 */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <LogoHeader />,
          headerRight: () => <LocationHeader />,
        }}
      />
      <Stack.Screen
        name="InvisiblePartner"
        component={InvisiblePartnerScreen}
        options={{ title: 'Kitchen Partner' }}
      />
      <Stack.Screen
        name="WholesaleForm"
        component={WholesaleFormScreen}
        options={{ title: 'Wholesale Inquiry' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Recipe Stack Navigator
 */
function RecipeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{
          headerTitle: () => <LogoHeader />,
        }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe Details' }}
      />
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ title: 'Add New Recipe', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Cart Stack Navigator
 */
function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="CartMain"
        component={CartScreen}
        options={{
          headerTitle: () => <LogoHeader />,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Main Tab Navigator
 */
function MainTabs() {
  const { location } = useLocationStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20, // Increased elevation for Android
          shadowColor: '#000', // Stronger shadow for iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          // Let standard safe area handling work, but ensure we have some minimal padding
          // The tab navigator handles safe area automatically if we don't force a height
          paddingTop: 8,
        },
        tabBarItemStyle: {
          // Adjust item spacing if needed, but usually default is fine
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipeStack}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MissionsTab"
        component={GoalsScreen}
        options={{
          tabBarLabel: 'My Goals',
          tabBarIcon: ({ color }) => <Ionicons name="rocket-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="CommunityTab"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: isServiceable ? 'Cart' : 'Shop',
          tabBarIcon: ({ color }) => <Feather name={isServiceable ? "shopping-cart" : "list"} size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Onboarding Stack Navigator
 */
function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthMethod" component={AuthMethodScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { hasCompletedOnboarding, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      {!hasCompletedOnboarding && !isAuthenticated ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingStack}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* Main App with Tabs */}
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              title: 'Edit Profile',
              presentation: 'modal',
            }}
          />

          {/* Location Screen (Modal) */}
          <Stack.Screen
            name="Location"
            component={LocationScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
              headerTitle: () => <LogoHeader />,
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TrackOrder"
            component={TrackOrderScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyOrders"
            component={MyOrdersScreen}
            options={{
              headerTitle: 'My Orders'
            }}
          />
          <Stack.Screen
            name="AdminRequests"
            component={AdminRequestsScreen}
            options={{
              title: 'Admin Dashboard',
              headerTitle: () => <LogoHeader />,
            }}
          />
          <Stack.Screen
            name="CreatorApplication"
            component={CreatorApplicationScreen}
            options={{
              title: 'Apply for Creator',
              headerTitle: () => <LogoHeader />,
            }}
          />
          <Stack.Screen
            name="RecipeSimulation"
            component={RecipeSimulationScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </>
      )}

      {/* Auth Screens (Modal) - Always accessible from root */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: () => <LogoHeader />,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: () => <LogoHeader />,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
