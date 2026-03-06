import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/colors';
import { Feather } from '@expo/vector-icons';
import { shadow as commonShadow } from '../constants/spacing';
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
import AdminRequestsScreen from '../screens/profile/AdminRequestsScreen';
import CreatorApplicationScreen from '../screens/profile/CreatorApplicationScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

const styles = StyleSheet.create({
  centralButtonShadow: {
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
});

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
          headerTitle: () => <UnifiedHeader />,
          headerStyle: {
            backgroundColor: colors.primary[500],
            elevation: 0,
            shadowOpacity: 0,
          },
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
          backgroundColor: colors.primary[500],
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
          headerTitle: () => <UnifiedHeader />,
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
  const offers = ['UPTO 50% OFF', 'BUY 1 GET 1'];
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % offers.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
      <MaterialCommunityIcons name="label-percent" size={24} color={colors.white} />
      <Text style={{ color: colors.white, fontSize: 8, fontWeight: '800', marginTop: -2 }}>
        {offers[index]}
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
      top: -12, // Moved slightly lower to align better with bottom boundary
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.centralButtonShadow,
    }}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View
      style={{
        width: 80, // Increased from 70
        height: 80, // Increased from 70
        borderRadius: 40, // Adjusted for new size
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5, // Slightly thicker border
        borderColor: '#fff',
      }}
    >
      <AnimatedOffers />
    </View>
  </TouchableOpacity>
);

/**
 * Animated Advertisement Text for Bottom Bar
 */
const AnimatedAdvs = () => {
  const [index, setIndex] = React.useState(0);
  const ads = ['GET 10% OFF', 'FREE DELIVERY', 'CASHBACK 5%'];
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % ads.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, minWidth: 60 }}>
      <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary[700] }}>{ads[index]}</Text>
      <Text style={{ fontSize: 8, fontWeight: '600', color: colors.gray[500], marginTop: 1 }}>TAP TO VIEW</Text>
    </Animated.View>
  );
};

/**
 * Rectangular Advertisement Tab Button (Licious-style)
 */
const RectTabButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -4,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -10,
    }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View
      style={{
        width: 105, // Increased from 85
        height: 44, // Increased from 38
        borderRadius: 10, // Slightly more rounded
        backgroundColor: '#FFF0F0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8, // Increased padding
        borderWidth: 1.5, // Slightly more prominent
        borderColor: colors.primary[100],
        ...commonShadow.soft,
      }}
    >
      <View style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
      }}>
        <MaterialCommunityIcons name="ticket-percent" size={16} color={colors.white} />
      </View>
      <View>
        <AnimatedAdvs />
      </View>
    </View>
  </TouchableOpacity>
);

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
            name="AdminRequests"
            component={AdminRequestsScreen}
            options={{
              title: 'Admin Dashboard',
              headerTitle: () => <UnifiedHeader />,
            }}
          />
          <Stack.Screen
            name="CreatorApplication"
            component={CreatorApplicationScreen}
            options={{
              title: 'Apply for Creator',
              headerTitle: () => <UnifiedHeader />,
            }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

      {/* Auth Screens (Modal) - Always accessible from root */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: () => <UnifiedHeader />,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: () => <UnifiedHeader />,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}



export default RootNavigator;
