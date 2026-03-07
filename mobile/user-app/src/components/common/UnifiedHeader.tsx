import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocationStore } from '../../stores/locationStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, shadow } from '../../constants/spacing';

import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/**
 * Unified Header Component
 * Order: Location -> BlueCrate Text -> Logo -> Profile
 */
export const UnifiedHeader = () => {
    const navigation = useNavigation<any>();
    const { location } = useLocationStore();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.headerWrapper, { paddingTop: insets.top + 8 }]}>
            <View style={styles.glassContainer}>
                <View style={styles.headerContent}>
                    <View style={styles.leftSection}>
                        {/* 1. Location Group */}
                        <TouchableOpacity
                            style={styles.locationGroup}
                            onPress={() => navigation.navigate('Location')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.roundIcon}>
                                <Feather name="map-pin" size={16} color={colors.primary[600]} />
                            </View>
                            <View>
                                <Text style={styles.deliveryTo}>Deliver to</Text>
                                <Text style={styles.locationText} numberOfLines={1}>
                                    {location}
                                </Text>
                            </View>
                            <Feather name="chevron-down" size={12} color={colors.gray[400]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rightSection}>
                        {/* 2. Brand Group */}
                        <View style={styles.brandGroup}>
                            <Text style={styles.brandText}>BlueCrate</Text>
                            <View style={styles.logoCircle}>
                                <Image
                                    source={require('../../../assets/images/new_logo.png')}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* 3. Profile Group */}
                        <TouchableOpacity
                            style={styles.profileGroup}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.7}
                        >
                            <Feather name="user" size={18} color={colors.primary[600]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        width: '100%',
        backgroundColor: colors.primary[600],
        paddingBottom: 8,
        zIndex: 9999,
    },
    glassContainer: {
        marginHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 24,
        ...shadow.medium,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 56,
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    locationGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    roundIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary[400],
        ...shadow.soft,
    },
    deliveryTo: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        fontFamily: typography.fontFamily.medium,
    },
    locationText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize: 12,
        maxWidth: width * 0.3,
    },
    brandGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandText: {
        fontSize: 13,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gray[100],
        ...shadow.soft,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    profileGroup: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
        borderWidth: 2,
        borderColor: colors.primary[400],
        overflow: 'hidden',
    },
    profileAvatar: {
        width: '100%',
        height: '100%',
    },
});

export default UnifiedHeader;
