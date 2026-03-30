import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { linkingConfig } from './src/navigation/linking';

/**
 * BlueCrateFoods Mobile App
 * 
 * Main entry point with React Navigation
 * Bottom tabs: Home, Recipes, Cart, Profile
 */

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linkingConfig}>
        <StatusBar style="dark" />
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}