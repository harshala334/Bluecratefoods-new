import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { Feather, Ionicons } from '@expo/vector-icons';
import { UnifiedHeader } from '../../components/common/UnifiedHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const OffersScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <UnifiedHeader />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>New Launches & Offers</Text>
                    <Text style={styles.subtitle}>Check out what's fresh and exciting at Blue Crate</Text>
                </View>

                {/* Exclusive Brand Banner */}
                <View style={styles.promoBanner}>
                    <View style={styles.promoInfo}>
                        <Text style={styles.promoBadge}>NEW</Text>
                        <Text style={styles.promoTitle}>Farm to Fork Essentials</Text>
                        <Text style={styles.promoDesc}>Premium selected cuts delivered within 45 mins.</Text>
                        <TouchableOpacity style={styles.shopNowBtn}>
                            <Text style={styles.shopNowText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.promoIcon}>
                        <Ionicons name="sparkles" size={60} color="rgba(255,255,255,0.3)" />
                    </View>
                </View>

                {/* Launch Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recently Launched</Text>
                    <View style={styles.launchGrid}>
                        {[1, 2].map((item) => (
                            <View key={item} style={styles.launchCard}>
                                <View style={[styles.imagePlaceholder, { backgroundColor: item === 1 ? '#E3F2FD' : '#FCE4EC' }]}>
                                    <Feather name="package" size={40} color={item === 1 ? '#1976D2' : '#C2185B'} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>Gourmet Series {item}</Text>
                                    <Text style={styles.cardPrice}>₹499</Text>
                                    <TouchableOpacity style={styles.addBtn}>
                                        <Text style={styles.addBtnText}>ADD</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Flash Offers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Flash Offers</Text>
                    <Text style={styles.viewAll}>View All</Text>
                </View>
                <View style={styles.offerCard}>
                    <View style={styles.offerTag}>
                        <Text style={styles.offerTagText}>FLAT 50% OFF</Text>
                    </View>
                    <View style={styles.offerContent}>
                        <Text style={styles.offerTitle}>Weekend Grocery Bonanza</Text>
                        <Text style={styles.offerCode}>Use Code: BLUE50</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: spacing.lg,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: 24,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[900],
    },
    subtitle: {
        fontSize: 14,
        color: colors.gray[500],
        marginTop: 4,
    },
    promoBanner: {
        margin: spacing.lg,
        backgroundColor: colors.primary[600],
        borderRadius: 20,
        padding: spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    promoInfo: {
        flex: 1,
        zIndex: 1,
    },
    promoBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '700',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    promoTitle: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    promoDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginBottom: 16,
    },
    shopNowBtn: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    shopNowText: {
        color: colors.primary[600],
        fontWeight: '700',
        fontSize: 14,
    },
    promoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.gray[800],
    },
    viewAll: {
        color: colors.primary[600],
        fontWeight: '600',
    },
    launchGrid: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
    },
    launchCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imagePlaceholder: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardContent: {
        gap: 4,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.gray[800],
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary[600],
    },
    addBtn: {
        borderWidth: 1,
        borderColor: colors.primary[500],
        borderRadius: 8,
        paddingVertical: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    addBtnText: {
        color: colors.primary[600],
        fontSize: 12,
        fontWeight: '700',
    },
    offerCard: {
        margin: spacing.lg,
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    offerTag: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    offerTagText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '800',
    },
    offerContent: {
        flex: 1,
    },
    offerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#92400E',
    },
    offerCode: {
        fontSize: 12,
        color: '#D97706',
        marginTop: 2,
    }
});

export default OffersScreen;
