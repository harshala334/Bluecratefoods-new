import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

export const LoginScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        await login(email, password);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>BlueCrate</Text>
                    <View style={styles.partnerBadge}>
                        <Text style={styles.partnerBadgeText}>PARTNER</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>Restaurant Dashboard</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Restaurant ID / Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. burger@partner.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.helpContainer}>
                    <Text style={styles.helpText}>Demo Credentials:</Text>
                    <Text style={styles.helpCode}>burger@partner.com (REST-001)</Text>
                    <Text style={styles.helpCode}>pizza@partner.com (REST-002)</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginTop: spacing['2xl'],
        marginBottom: spacing['3xl'],
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    logoText: {
        fontSize: typography.fontSize['3xl'],
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
    },
    partnerBadge: {
        backgroundColor: colors.primary[100],
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    partnerBadgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: 'bold',
        color: colors.primary[700],
    },
    subtitle: {
        fontSize: typography.fontSize.lg,
        color: colors.gray[500],
    },
    form: {
        gap: spacing.lg,
    },
    inputGroup: {
        gap: spacing.xs,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.gray[700],
    },
    input: {
        backgroundColor: colors.gray[50], // simple gray bg inputs
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
    },
    loginButton: {
        backgroundColor: colors.primary[600],
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.lg,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.fontSize.sm,
        textAlign: 'center',
    },
    helpContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.md,
    },
    helpText: {
        fontSize: typography.fontSize.sm,
        fontWeight: 'bold',
        color: colors.gray[600],
        marginBottom: spacing.xs,
    },
    helpCode: {
        fontSize: typography.fontSize.sm,
        fontFamily: 'monospace', // if supported, else falls back
        color: colors.gray[500],
    },
});

export default LoginScreen;
