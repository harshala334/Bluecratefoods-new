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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
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
                    <SafeAreaView style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.brandName}>Blue Crate</Text>
                            <Text style={styles.tagline}>Ready-to-Cook. Ready-to-Love.</Text>
                            <Image
                                source={require('../../../assets/images/new_logo.png')}
                                style={styles.welcomeLogo}
                                resizeMode="contain"
                            />
                        </View>

                        <Image
                            source={require('../../../assets/images/kitty_with_cart-removebg-preview.png')}
                            style={styles.kittyMascot}
                            resizeMode="contain"
                        />

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('AuthMethod')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginText}>
                                    Already have an account? <Text style={styles.loginAccent}>Log in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
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
    kittyMascot: {
        position: 'absolute',
        top: 520,
        left: -20,
        width: 260,
        height: 260,
        opacity: 0.9,
        zIndex: -1, // Bring forward to overlap slightly
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
