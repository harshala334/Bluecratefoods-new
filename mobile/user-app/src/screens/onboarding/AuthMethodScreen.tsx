import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import useAuthStore from '../../stores/authStore';
import { authService } from '../../services/authService';
import { Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes, auth } from '../../utils/authProvider';

const AuthMethodScreen = ({ navigation }: any) => {
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const googleLogin = useAuthStore((state) => state.googleLogin);
    const skipLogin = useAuthStore((state) => state.skipLogin);
    const isLoading = useAuthStore((state) => state.isLoading);

    const handleSkip = async () => {
        await skipLogin();
    };

    const handleContinue = async () => {
        if (phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            // Formatting phone number
            const formattedPhone = phone.startsWith('+') ? phone : `${countryCode}${phone}`;
            // We now use our custom backend's sendOtp (MSG91)
            const response = await authService.sendOtp(formattedPhone);

            if (response.success) {
                navigation.navigate('OTP', { phone: formattedPhone });
            } else {
                Alert.alert('Error', response.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            console.error('Phone auth error:', error);
            Alert.alert('Error', 'Failed to send OTP. ' + (error.message || ''));
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            // Check if we have the idToken
            const idToken = userInfo.data?.idToken;
            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID Token received');
            }

            await googleLogin(idToken);
            // RootNavigator will handle navigation
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('Google login cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log('Google login in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Play services not available');
            } else {
                console.error('Google login error:', error);
                Alert.alert('Error', 'Google login failed.');
            }
        }
    };

    const handleEmailLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.keyboardView}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                    <Feather name="arrow-left" size={24} color={colors.text.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSkip}>
                                    <Text style={{ color: colors.primary[500], fontWeight: '600', fontSize: 16 }}>Skip for now</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>Enter your mobile number</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                style={styles.countryPicker}
                                onPress={() => Alert.alert('Select Country', 'Currently only +91 (India) is supported.', [{ text: 'OK' }])}
                            >
                                <Text style={styles.countryCode}>{countryCode}</Text>
                                <Feather name="chevron-down" size={16} color={colors.gray[400]} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="9999999999"
                                keyboardType="number-pad"
                                value={phone}
                                onChangeText={setPhone}
                                autoFocus={Platform.OS !== 'web'}
                                pointerEvents="auto"
                                editable={true}
                            />
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>or connect with social</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                                <Feather name="mail" size={20} color={colors.text.primary} />
                                <Text style={styles.socialButtonText}>Continue with Email</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.primary[500]} />
                                ) : (
                                    <>
                                        <Ionicons name="logo-google" size={20} color={colors.text.primary} />
                                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton} onPress={handleSkip}>
                                <Feather name="fast-forward" size={20} color={colors.primary[500]} />
                                <Text style={[styles.socialButtonText, { color: colors.primary[600] }]}>Skip & Browse App</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.termsText}>
                                By continuing, you agree to our{' '}
                                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                                <Text style={styles.linkText}>Privacy Policy</Text>.
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    (phone.length < 10 || isLoading) && styles.continueButtonDisabled
                                ]}
                                onPress={handleContinue}
                                disabled={phone.length < 10 || isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.continueButtonText}>Continue</Text>
                                        <Feather name="arrow-right" size={20} color="white" style={styles.arrowIcon} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
    },
    backButton: {
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        backgroundColor: colors.gray[50],
        paddingHorizontal: 16,
        height: 58,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: colors.gray[200],
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray[200],
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: colors.gray[500],
    },
    socialButtons: {
        gap: 12,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        backgroundColor: 'white',
    },
    socialButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    termsText: {
        fontSize: 12,
        color: colors.gray[500],
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 24,
    },
    linkText: {
        color: colors.text.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    continueButton: {
        backgroundColor: colors.primary[500],
        height: 58,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    continueButtonDisabled: {
        backgroundColor: colors.gray[300],
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    arrowIcon: {
        marginLeft: 8,
    },
});

export default AuthMethodScreen;
