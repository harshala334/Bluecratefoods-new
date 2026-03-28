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

import useAuthStore from '../../stores/authStore';

/**
 * Register Screen
 */

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await signup(name, email, password);

      Alert.alert('Success', 'Account created successfully!');

      // Navigate to Main to dismiss modal and show home
      navigation.navigate('Main');
    } catch (err: any) {
      console.error('Registration error:', err);
      Alert.alert(
        'Registration Failed',
        err.response?.data?.message || 'Could not create account. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
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
  registerButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerButtonText: {
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
  registerButtonDisabled: {
    opacity: 0.7,
  },
});

export default RegisterScreen;
