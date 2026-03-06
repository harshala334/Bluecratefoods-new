import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocationStore } from '../../stores/locationStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

/**
 * Unified Header Component
 * Order: Location -> BlueCrate Text -> Logo -> Profile
 */
export const UnifiedHeader = () => {
    const navigation = useNavigation<any>();
    const { location } = useLocationStore();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftSection}>
                {/* 1. Location Group */}
                <TouchableOpacity
                    style={styles.locationGroup}
                    onPress={() => navigation.navigate('Location')}
                    activeOpacity={0.7}
                >
                    <Feather name="map-pin" size={14} color={colors.white} />
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                        {location}
                    </Text>
                    <Feather name="chevron-down" size={12} color={colors.white} style={{ opacity: 0.8 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.rightSection}>
                {/* 2. Brand Group (Text > Logo) */}
                <View style={styles.brandGroup}>
                    <Text style={styles.brandText}>Blue Crate</Text>
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
                    <Feather name="user" size={18} color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 32, // Adjusting for typical screen padding
        height: 44,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    locationGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 12,
        height: 32,
        borderRadius: 16,
        gap: 6,
        minWidth: 120,
        maxWidth: width * 0.45,
    },
    locationText: {
        color: colors.white,
        fontFamily: typography.fontFamily.semibold,
        fontSize: typography.fontSize.xs,
        maxWidth: 120,
    },
    brandGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    brandText: {
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    logoCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    profileGroup: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UnifiedHeader;
