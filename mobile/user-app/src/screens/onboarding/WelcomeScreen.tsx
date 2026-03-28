import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import useAuthStore from '../../stores/authStore';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const skipLogin = useAuthStore((state) => state.skipLogin);
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require('../../../assets/images/onboarding_welcome_bg.png')}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                    style={styles.gradient}
                >
                    <View style={[styles.content, {
                        paddingTop: Math.max(insets.top, 24),
                        paddingBottom: Math.max(insets.bottom, 24)
                    }]}>
                        <View style={styles.header}>
                            <Text style={styles.brandName}>Blue Crate</Text>
                            <Text style={styles.tagline}>Ready-to-Cook. Ready-to-Love.</Text>
                            <Image
                                source={require('../../../assets/images/new_logo.png')}
                                style={styles.welcomeLogo}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.buttonContainer}>
                                <View style={styles.kittyWrapper} pointerEvents="none">
                                    <Image
                                        source={require('../../../assets/images/kitty_with_cart_cropped.png')}
                                        style={styles.kittyMascot}
                                        resizeMode="contain"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate('AuthMethod')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Login / Sign Up</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={() => skipLogin()}
                            >
                                <Text style={styles.loginText}>
                                    New to Blue Crate? <Text style={styles.loginAccent}>Explore as Guest</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        position: 'relative',
        width: '100%',
    },
    kittyWrapper: {
        position: 'absolute',
        bottom: 10,        // Significantly pulled down for solid overlap so she doesn't float
        left: -12,         // Added a bit more left offset for a natural look
        zIndex: 10,
        elevation: 10,
    },
    kittyMascot: {
        width: 220,
        height: 220,
    },
    welcomeLogo: {
        position: 'absolute',
        width: 230,
        height: 230,
        top: 20,
    },
    brandName: {
        fontSize: 48,
        fontFamily: typography.fontFamily.display,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: -1,
        marginTop: 250, // Adjust this without moving the logo
        textAlign: 'center',
        width: '100%',
    },
    logoAccent: {
        color: colors.primary[400],
    },
    tagline: {
        fontSize: 18,
        fontFamily: typography.fontFamily.body,
        color: 'rgba(255, 255, 255, 0.9)', // Slightly more visible
        marginTop: 12,
        lineHeight: 26,
        maxWidth: '85%',
        textAlign: 'center',
        alignSelf: 'center',
        letterSpacing: 0.5,
    },
    footer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary[500],
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
    },
    loginAccent: {
        color: 'white',
        fontWeight: '600',
    },
});

export default WelcomeScreen;
