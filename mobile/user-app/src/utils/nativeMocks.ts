import { Alert } from 'react-native';

/**
 * Mock versions of native modules that fail in standard Expo Go.
 * These allow the UI to function without a Development Build.
 */

export const mockGoogleSignin = {
    configure: (config: any) => {
        console.log('[MOCK] GoogleSignin.configure', config);
    },
    hasPlayServices: async () => {
        console.log('[MOCK] GoogleSignin.hasPlayServices');
        return true;
    },
    signIn: async () => {
        console.log('[MOCK] GoogleSignin.signIn');
        return {
            data: {
                idToken: 'mock-google-id-token',
                user: {
                    id: 'mock-user-id',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    photo: 'https://via.placeholder.com/150',
                    givenName: 'Demo',
                    familyName: 'User',
                }
            }
        };
    },
};

export const mockFirebaseAuth = () => {
    return {
        signInWithPhoneNumber: async (phone: string) => {
            console.log('[MOCK] signInWithPhoneNumber', phone);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                confirm: async (code: string) => {
                    console.log('[MOCK] confirm code', code);
                    return {
                        user: {
                            getIdToken: async () => 'mock-firebase-id-token',
                            phoneNumber: phone,
                            uid: 'mock-firebase-uid',
                        }
                    };
                }
            };
        },
    };
};

export const mockRazorpay = {
    open: (options: any) => {
        console.log('[MOCK] Razorpay.open', options);
        return new Promise((resolve) => {
            Alert.alert(
                'Mock Payment Success',
                'Since you are on Expo Go, we are using a mock payment dialog.',
                [
                    {
                        text: 'Simulate Success',
                        onPress: () => resolve({
                            razorpay_payment_id: 'pay_MOCK' + Date.now(),
                            razorpay_order_id: options.order_id,
                            razorpay_signature: 'mock_signature'
                        })
                    }
                ]
            );
        });
    }
};

export const statusCodes = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};
