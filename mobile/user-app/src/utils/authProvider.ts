/**
 * Auth Provider - Provides a clean abstraction for Auth modules.
 * This prevents Metro from crashing when native modules are missing in Expo Go.
 */

const IS_EXPO_GO = true; // Force true for now to fix user's crash

let GoogleSignin: any;
let auth: any;
let statusCodes: any;

if (IS_EXPO_GO) {
    const mocks = require('./nativeMocks');
    GoogleSignin = mocks.mockGoogleSignin;
    statusCodes = mocks.statusCodes;
    auth = mocks.mockFirebaseAuth;
    console.log('[AuthProvider] Using Mocks for Expo Go');
} else {
    // In a real development build, these would be imported normally.
    // We use 'require' to prevent static analysis failures in Expo Go.
    try {
        const GS = require('@react-native-google-signin/google-signin');
        const FA = require('@react-native-firebase/auth').default;
        GoogleSignin = GS.GoogleSignin;
        statusCodes = GS.statusCodes;
        auth = FA;
    } catch (e) {
        console.warn('[AuthProvider] Native modules failed to load, falling back to mocks.');
        const mocks = require('./nativeMocks');
        GoogleSignin = mocks.mockGoogleSignin;
        statusCodes = mocks.statusCodes;
        auth = mocks.mockFirebaseAuth;
    }
}

export { GoogleSignin, auth, statusCodes };
