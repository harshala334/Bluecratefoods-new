import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { Feather } from '@expo/vector-icons';
import { shadow as commonShadow } from '../constants/spacing';
import { typography } from '../constants/typography';
import UnifiedHeader from '../components/common/UnifiedHeader';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import CategoryDetailScreen from '../screens/category/CategoryDetailScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import ProductListScreen from '../screens/product/ProductListScreen';
import InvisiblePartnerScreen from '../screens/home/InvisiblePartnerScreen';
import WholesaleFormScreen from '../screens/wholesale/WholesaleFormScreen';
import CartScreen from '../../src/screens/cart/CartScreen';
import CheckoutScreen from '../../src/screens/cart/CheckoutScreen';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';
import EditProfileScreen from '../../src/screens/profile/EditProfileScreen';
import LocationScreen from '../../src/screens/location/LocationScreen';
import ComingSoonScreen from '../screens/common/ComingSoonScreen';
import OffersScreen from '../screens/common/OffersScreen';
import GoalsScreen from '../screens/goals/GoalsScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import TrackOrderScreen from '../screens/orders/TrackOrderScreen';
import { MyOrdersScreen } from '../screens/orders/MyOrdersScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// New Profile Screens
import DietaryPreferencesScreen from '../screens/profile/DietaryPreferencesScreen';
import FavoritesScreen from '../screens/profile/FavoritesScreen';
import ManageAddressesScreen from '../screens/profile/ManageAddressesScreen';

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
const { width: windowWidth } = Dimensions.get('window');


/**
 * Home Stack Navigator
 */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
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
          header: () => <UnifiedHeader />,
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
 * Product Stack Navigator
 */
function ProductStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CategoryDetail"
        component={CategoryDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
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
          headerShown: false,
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
 * Animated Offer Text for Bottom Bar
 */
const AnimatedOffers = () => {
  const [index, setIndex] = React.useState(0);
  const offers = [
    { icon: '🏷️', line1: 'UPTO', line2: '50% OFF' },
    { icon: '🎁', line1: 'BUY 1', line2: 'GET 1' },
    { icon: '🚚', line1: 'FREE', line2: 'DELIVERY' },
  ];
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.85, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % offers.length);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const current = offers[index];

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
      <Text style={{ fontSize: 20, lineHeight: 24 }}>{current.icon}</Text>
      <Text style={{
        color: colors.white,
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.5,
        opacity: 0.85,
        lineHeight: 10,
      }}>
        {current.line1}
      </Text>
      <Text style={{
        color: colors.white,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.3,
        lineHeight: 13,
      }}>
        {current.line2}
      </Text>
    </Animated.View>
  );
};

/**
 * Custom Circular Tab Button
 */
const CentralTabButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 2,
    }}
    onPress={onPress}
    activeOpacity={0.85}
  >
    {/* Outer glow ring */}
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -2,
        opacity: 0.5,
      }}
    />
    {/* Main button */}
    <LinearGradient
      colors={[colors.primary[400], colors.primary[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        ...commonShadow.medium,
      }}
    >
      {/* Inner subtle ring */}
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.25)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedOffers />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);


/**
 * Animated Advertisement Text for Bottom Bar
 */
const AnimatedAdvs = () => {
  const [index, setIndex] = React.useState(0);
  const ads = [
    { emoji: '🔥', line1: 'GET 10%', line2: 'OFF NOW' },
    { emoji: '🚚', line1: 'FREE', line2: 'DELIVERY' },
    { emoji: '💰', line1: 'CASHBACK', line2: '5% TODAY' },
  ];
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -8, duration: 350, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % ads.length);
        slideAnim.setValue(8);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = ads[index];
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Text style={{ fontSize: 10, lineHeight: 12 }}>{current.emoji}</Text>
        <Text style={{ fontSize: 9, fontWeight: '800', color: colors.white, letterSpacing: 0.2, opacity: 0.9 }}>
          {current.line1}
        </Text>
      </View>
      <Text style={{ fontSize: 11, fontWeight: '900', color: colors.white, letterSpacing: 0.3, lineHeight: 13 }}>
        {current.line2}
      </Text>
    </Animated.View>
  );
};

const PulsingDot = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 14, height: 14, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
      <Animated.View style={{
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: colors.white,
        opacity: 0.4,
        transform: [{ scale: pulseAnim }],
        position: 'absolute',
      }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white }} />
    </View>
  );
};


/**
 * Rectangular Advertisement Tab Button (Premium Style)
 */
const RectTabButton = ({ onPress }: any) => {
  const tabWidth = windowWidth / 5;
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.orange[500], colors.orange[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: -20, // Extend further into the on-screen area
          width: 220, // Increased to maintain right-side bleed
          height: 48,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 1.5,
          borderColor: colors.orange[400],
          borderRightWidth: 0,
          ...commonShadow.soft,
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        <View style={{ width: tabWidth, alignItems: 'center', position: 'relative', marginLeft: 6 }}>
          <View style={{ position: 'absolute', top: -14, right: -12, zIndex: 10 }}>
            <PulsingDot />
          </View>
          <AnimatedAdvs />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

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
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: 80,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: typography.fontFamily.bold,
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
        name="ProductsTab"
        component={ProductStack}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => <Feather name="package" size={24} color={color} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="OffersTab"
        component={OffersScreen}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="label-percent" size={32} color={colors.white} />
          ),
          tabBarButton: (props) => <CentralTabButton {...props} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={24} color={color} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="AdvsTab"
        component={MyOrdersScreen}
        options={{
          tabBarLabel: '', // Hide default label as we have text in the rect
          tabBarButton: (props) => <RectTabButton {...props} />,
          headerTitle: 'Promotions',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primary[500],
          },
          headerTintColor: colors.white,
        }}
      />

      {/* 
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
      */}
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

function RootNavigator() {
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
              headerShown: false,
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
            name="Subscription"
            component={SubscriptionScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Real Profile Utility Screens */}
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageAddresses"
            component={ManageAddressesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DietaryPreferences"
            component={DietaryPreferencesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payments"
            component={ComingSoonScreen}
            options={{ title: 'Payment Methods' }}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={ComingSoonScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen
            name="PrivacySecurity"
            component={ComingSoonScreen}
            options={{ title: 'Privacy & Security' }}
          />
          <Stack.Screen
            name="HelpCenter"
            component={ComingSoonScreen}
            options={{ title: 'Help & Support' }}
          />
        </>
      )}

      {/* Auth Screens (Modal) - Always accessible from root */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}



export default RootNavigator;
