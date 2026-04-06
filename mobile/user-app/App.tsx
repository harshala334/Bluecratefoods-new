import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { linkingConfig } from './src/navigation/linking';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/services/queryClient';
import { useSync } from './src/hooks/useSync';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * BlueCrateFoods Mobile App
 * 
 * Main entry point with React Navigation
 * Bottom tabs: Home, Recipes, Cart, Profile
 */

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  // Use custom hook to check for sync updates on app start/focus
  useSync();

  return (
    <NavigationContainer linking={linkingConfig}>
      <StatusBar style="dark" />
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}