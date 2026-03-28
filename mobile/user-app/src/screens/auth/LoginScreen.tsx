import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants/config';
import { Alert, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

import useAuthStore from '../../stores/authStore';

/**
 * Login Screen
 */

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const storeError = useAuthStore((state) => state.error);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
        position: 'bottom',
        visibilityTime: 3000,
      });

      // Navigate to Main to dismiss modal and show home
      navigation.navigate('Main');
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (setter: any) => (text: string) => {
    setter(text);
    if (localError) setLocalError(null);
  };

  const displayError = localError || storeError;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, displayError && styles.inputError]}
              placeholder="Enter your email"
              value={email}
              onChangeText={handleInputChange(setEmail)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, displayError && styles.inputError]}
              placeholder="Enter your password"
              value={password}
              onChangeText={handleInputChange(setPassword)}
              secureTextEntry
            />
          </View>

          {displayError && (
            <Text style={styles.errorText}>{displayError}</Text>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    backgroundColor: colors.white,
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
  linkText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginTop: spacing.md,
  },
  linkHighlight: {
    color: colors.primary[600],
    fontFamily: typography.fontFamily.semibold,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  inputError: {
    borderColor: colors.error || '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    color: colors.error || '#ef4444',
    fontSize: typography.fontSize.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
});

export default LoginScreen;
