import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../../constants/colors';
import useAuthStore from '../../stores/authStore';

const LocationPermissionScreen = ({ navigation }: any) => {
    const completeOnboarding = useAuthStore((state: any) => state.completeOnboarding);

    const handleRequestPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Force complete onboarding state
                if (completeOnboarding) {
                    await completeOnboarding();
                }
            } else {
                Alert.alert(
                    'Location Needed',
                    'We need your location to show available food partners in your area.',
                    [
                        { text: 'Try Again', onPress: handleRequestPermission },
                        { text: 'Skip for now', onPress: handleSkip }
                    ]
                );
            }
        } catch (error) {
            console.error('Location error:', error);
            handleSkip();
        }
    };

    const handleSkip = async () => {
        if (completeOnboarding) {
            await completeOnboarding();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.main}>
                    <View style={styles.iconContainer}>
                        <Feather name="map-pin" size={80} color={colors.primary[500]} />
                    </View>

                    <Text style={styles.title}>Enable location access</Text>
                    <Text style={styles.description}>
                        BlueCrate needs your location to find the best restaurants and deliver your food fresh and hot.
                    </Text>

                    <View style={styles.features}>
                        <View style={styles.featureItem}>
                            <Feather name="check" size={20} color={colors.green[500]} />
                            <Text style={styles.featureText}>Find restaurants near you</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="check" size={20} color={colors.green[500]} />
                            <Text style={styles.featureText}>Real-time delivery tracking</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="check" size={20} color={colors.green[500]} />
                            <Text style={styles.featureText}>Personalized recommendations</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.enableButton}
                        onPress={handleRequestPermission}
                    >
                        <Text style={styles.enableButtonText}>Enable Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Not now, I'll enter manually</Text>
                    </TouchableOpacity>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
        height: 44,
    },
    backButton: {},
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: colors.gray[500],
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    features: {
        width: '100%',
        gap: 16,
        paddingHorizontal: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 15,
        color: colors.gray[700],
        fontWeight: '500',
    },
    footer: {
        marginBottom: 20,
        gap: 12,
    },
    enableButton: {
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
    enableButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    skipButton: {
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButtonText: {
        color: colors.gray[500],
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LocationPermissionScreen;
