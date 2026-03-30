import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_ADDRESSES = [
    {
        id: '1',
        label: 'Home',
        address: '123, Park Street, Kolkata, WB 700016',
        isDefault: true,
        icon: 'home-outline',
    },
    {
        id: '2',
        label: 'Office',
        address: 'Salt Lake Sector V, Kolkata, WB 700091',
        isDefault: false,
        icon: 'business-outline',
    },
];

import useAuthStore from '../../stores/authStore';

export const ManageAddressesScreen = ({ navigation }: any) => {
    const { isGuest, isAuthenticated } = useAuthStore();
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

    if (isGuest || !isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manage Addresses</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.guestContainer}>
                    <View style={styles.guestIconCircle}>
                        <Ionicons name="location-outline" size={60} color={colors.primary[500]} />
                    </View>
                    <Text style={styles.guestTitle}>Login to Manage Addresses</Text>
                    <Text style={styles.guestSubtitle}>Save your home and work addresses for faster checkout.</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('AuthMethod')}
                    >
                        <Text style={styles.loginButtonText}>Login Now</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const deleteAddress = (id: string) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Addresses</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Feather name="plus" size={24} color={colors.primary[500]} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {addresses.map((item) => (
                    <View key={item.id} style={[styles.addressCard, item.isDefault && styles.defaultCard]}>
                        <View style={styles.cardHeader}>
                            <View style={styles.labelRow}>
                                <View style={[styles.iconBox, { backgroundColor: item.isDefault ? colors.primary[50] : colors.gray[50] }]}>
                                    <Ionicons
                                        name={item.icon as any}
                                        size={20}
                                        color={item.isDefault ? colors.primary[500] : colors.gray[500]}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.addressLabel}>{item.label}</Text>
                                    {item.isDefault && <Text style={styles.defaultBadge}>DEFAULT</Text>}
                                </View>
                            </View>
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.actionIcon}>
                                    <Feather name="edit-2" size={18} color={colors.gray[400]} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionIcon}
                                    onPress={() => deleteAddress(item.id)}
                                >
                                    <Feather name="trash-2" size={18} color="#D32F2F" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.addressText}>{item.address}</Text>

                        {!item.isDefault && (
                            <TouchableOpacity style={styles.setAsDefault}>
                                <Text style={styles.setAsDefaultText}>Set as Default</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity style={styles.addNewCard}>
                    <View style={styles.addNewIcon}>
                        <Ionicons name="location-outline" size={24} color={colors.primary[600]} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addNewTitle}>Add New Address</Text>
                        <Text style={styles.addNewSubtitle}>Set up a new delivery location</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[50],
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.gray[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    addressCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadow.soft,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    defaultCard: {
        borderColor: colors.primary[200],
        backgroundColor: colors.white,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressLabel: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    defaultBadge: {
        fontSize: 9,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
        backgroundColor: colors.primary[50],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 2,
        alignSelf: 'flex-start',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionIcon: {
        padding: 4,
    },
    addressText: {
        fontSize: 14,
        color: colors.gray[600],
        lineHeight: 20,
        fontFamily: typography.fontFamily.medium,
        marginBottom: spacing.md,
    },
    setAsDefault: {
        borderTopWidth: 1,
        borderTopColor: colors.gray[50],
        paddingTop: spacing.md,
    },
    setAsDefaultText: {
        fontSize: 14,
        color: colors.primary[600],
        fontFamily: typography.fontFamily.bold,
    },
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: 20,
        marginTop: spacing.md,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.primary[300],
        gap: spacing.md,
    },
    addNewIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    addNewTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    addNewSubtitle: {
        fontSize: 12,
        color: colors.gray[500],
        fontFamily: typography.fontFamily.medium,
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.white,
    },
    guestIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    guestTitle: {
        fontSize: 20,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    guestSubtitle: {
        fontSize: 14,
        color: colors.gray[500],
        textAlign: 'center',
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        lineHeight: 20,
    },
    loginButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: 40,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        ...shadow.medium,
    },
    loginButtonText: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
});

export default ManageAddressesScreen;
