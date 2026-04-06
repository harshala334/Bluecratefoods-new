import React, { useState, useEffect, useRef } from 'react';
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
import { auth } from '../../utils/authProvider';

const OTPScreen = ({ navigation, route }: any) => {
    const { phone } = route.params || { phone: 'your phone' };
    const [otp, setOtp] = useState(['', '', '', '']); 
    const [timer, setTimer] = useState(30);
    const [attempts, setAttempts] = useState(0);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const otpLogin = useAuthStore((state) => state.otpLogin);
    const skipLogin = useAuthStore((state) => state.skipLogin);
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify if all digits are entered
        if (newOtp.every(digit => digit !== '') && index === 3) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleVerify = async (code: string) => {
        if (attempts >= 5) {
            Alert.alert('Too Many Attempts', 'You have entered the wrong OTP too many times. Please request a new one.');
            return;
        }

        if (!code || code.length < 4) {
            Alert.alert('Error', 'Please enter a valid 4-digit OTP');
            return;
        }

        try {
            await otpLogin(phone, code);
            // RootNavigator will handle navigation as state changes
            if (route.params?.redirectTo) {
                navigation.navigate(route.params.redirectTo);
            }
        } catch (error: any) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            // Clear OTP fields for retry
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();

            if (newAttempts >= 5) {
                Alert.alert('Incorrect OTP', 'Too many failed attempts. Please go back and try again later or register a new number.');
            } else {
                Alert.alert(
                    'Incorrect OTP', 
                    `The code you entered is incorrect. You have ${5 - newAttempts} attempts left.`
                );
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(30);
            // Logic to resend OTP would go here
        }
    };

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.keyboardView}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Feather name="arrow-left" size={24} color={colors.text.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => skipLogin()}>
                                    <Text style={{ color: colors.primary[500], fontWeight: '600', fontSize: 16 }}>Skip for now</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>Enter the 4-digit code</Text>
                            <Text style={styles.subtitle}>
                                Sent to <Text style={styles.phoneText}>{phone}</Text>
                            </Text>
                        </View>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        inputRefs.current[index] = ref;
                                    }}
                                    style={styles.otpInput}
                                    keyboardType={Platform.OS === 'web' ? 'phone-pad' : 'number-pad'}
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    autoFocus={Platform.OS !== 'web' && index === 0}
                                    autoComplete="one-time-code"
                                    textContentType="oneTimeCode"
                                />
                            ))}
                        </View>

                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Didn't receive it? </Text>
                            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                                <Text style={[styles.resendLink, timer > 0 && styles.resendLinkDisabled]}>
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.verifyButton,
                                    (otp.some(digit => digit === '') || isLoading) && styles.verifyButtonDisabled
                                ]}
                                onPress={() => handleVerify(otp.join(''))}
                                disabled={otp.some(digit => digit === '') || isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.verifyButtonText}>Verify & Continue</Text>
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
        marginBottom: 40,
    },
    backButton: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[500],
        lineHeight: 24,
    },
    phoneText: {
        fontWeight: '600',
        color: colors.text.primary,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    otpInput: {
        width: 60,
        height: 70,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 16,
        backgroundColor: colors.gray[50],
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        color: colors.text.primary,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: colors.gray[500],
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary[600],
    },
    resendLinkDisabled: {
        color: colors.gray[400],
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    verifyButton: {
        backgroundColor: colors.primary[500],
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    verifyButtonDisabled: {
        backgroundColor: colors.gray[300],
        shadowOpacity: 0,
        elevation: 0,
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default OTPScreen;
