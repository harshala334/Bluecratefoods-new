import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import useAuthStore from '../../stores/authStore';
import { authService } from '../../services/authService';
import { Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: '1069338996291-soumd199113mj5jej337snc28ou88dop.apps.googleusercontent.com',
    offlineAccess: true,
});

const AuthMethodScreen = ({ navigation }: any) => {
    const [phone, setPhone] = useState('');
    const googleLogin = useAuthStore((state) => state.googleLogin);
    const isLoading = useAuthStore((state) => state.isLoading);

    const handleContinue = async () => {
        if (phone.length >= 10) {
            try {
                // Formatting phone number for Firebase (assuming India +91 for now)
                const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
                const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
                navigation.navigate('OTP', { phone: formattedPhone, confirmation });
            } catch (error: any) {
                console.error('Phone auth error:', error);
                Alert.alert('Error', 'Failed to send OTP. ' + (error.message || ''));
            }
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Feather name="arrow-left" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Enter your mobile number</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.countryPicker}>
                                <Text style={styles.countryCode}>+1</Text>
                                <Feather name="chevron-down" size={16} color={colors.gray[400]} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="201-555-0123"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                autoFocus
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

                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={20} color={colors.text.primary} />
                                <Text style={styles.socialButtonText}>Continue with Apple</Text>
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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        marginBottom: 24,
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
