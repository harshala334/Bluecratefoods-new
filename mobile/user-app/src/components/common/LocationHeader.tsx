import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocationStore } from '../../stores/locationStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export const LocationHeader = () => {
    const navigation = useNavigation<any>();
    const { location } = useLocationStore();

    return (
        <View style={styles.wrapper}>

            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Location')}
                activeOpacity={0.7}
            >
                <Feather name="map-pin" size={14} color={colors.white} />
                <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{location}</Text>
                <Feather name="chevron-down" size={12} color={colors.white} style={{ opacity: 0.8 }} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.premiumContainer}
                onPress={() => navigation.navigate('Subscription')} // Or wherever you want it to go
                activeOpacity={0.7}
            >
                <Feather name="award" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.7}
            >
                <Feather name="user" size={20} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        gap: 6,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        maxWidth: 120, // Strict total width cap
    },
    premiumContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.white,
        fontFamily: typography.fontFamily.semibold,
        fontSize: typography.fontSize.xs, // Reduced font size slightly
        maxWidth: 70, // Reduced from 100
    },
    premiumText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.xs,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LocationHeader;
