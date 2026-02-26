import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import { useAuthStore } from './src/stores/authStore';

type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    id="RootNavigator"
                    screenOptions={{ headerShown: false }}
                >
                    {!isAuthenticated ? (
                        <Stack.Screen name="Login" component={LoginScreen} />
                    ) : (
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
