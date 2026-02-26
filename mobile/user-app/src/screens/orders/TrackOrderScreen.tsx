import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderStore } from '../../stores/orderStore';
import { Order } from '../../types/order';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';
import { Ionicons, Feather } from '@expo/vector-icons';

/**
 * Track Order Screen
 * Visualization of the order status for the user
 */

const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: 'receipt-outline', description: 'Waiting for restaurant confirmation' },
    { key: 'PREPARING', label: 'Preparing', icon: 'restaurant-outline', description: 'Chef is working on your meal' },
    { key: 'READY', label: 'On the Way', icon: 'bicycle-outline', description: 'Your order is out for delivery' },
    { key: 'COMPLETED', label: 'Delivered', icon: 'checkmark-circle-outline', description: 'Enjoy your meal!' },
];

export const TrackOrderScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { activeOrders, orders, loadOrders } = useOrderStore();

    // Get order from params or most recent active
    const orderId = route?.params?.orderId;
    const currentOrder = orderId
        ? orders.find(o => o.id === orderId)
        : activeOrders[0];

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 3000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    if (!currentOrder) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <Feather name="shopping-bag" size={60} color={colors.gray[300]} />
                <Text style={styles.emptyTitle}>No Order Found</Text>
                <Text style={styles.emptyText}>We couldn't find the order details.</Text>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Text style={styles.homeButtonText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === currentOrder.status);
    const isCancelled = currentOrder.status === 'CANCELLED';

    const renderTimeline = () => {
        if (isCancelled) {
            return (
                <View style={styles.cancelledCard}>
                    <Ionicons name="alert-circle" size={40} color={colors.error} />
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                    <Text style={styles.cancelledText}>Please contact support for more details.</Text>
                </View>
            );
        }

        return (
            <View style={styles.timelineContainer}>
                {STATUS_STEPS.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isLast = index === STATUS_STEPS.length - 1;

                    return (
                        <View key={step.key} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <View style={[
                                    styles.timelineDot,
                                    (isActive || isCompleted) && styles.timelineDotActive,
                                    isActive && styles.timelineDotCurrent
                                ]}>
                                    <Ionicons
                                        name={step.icon as any}
                                        size={16}
                                        color={(isActive || isCompleted) ? colors.white : colors.gray[400]}
                                    />
                                </View>
                                {!isLast && (
                                    <View style={[
                                        styles.timelineLine,
                                        isCompleted && styles.timelineLineActive
                                    ]} />
                                )}
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={[
                                    styles.timelineLabel,
                                    (isActive || isCompleted) && styles.timelineLabelActive
                                ]}>{step.label}</Text>
                                <Text style={styles.timelineDesc}>{step.description}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Map Placeholder */}
                <View style={styles.mapPlaceholder}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }}
                        style={styles.mapImage}
                    />
                    <View style={styles.mapOverlay} />
                    <View style={[styles.headerFloating, { top: insets.top + spacing.md }]}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}>
                            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                        <View style={styles.orderIdBadge}>
                            <Text style={styles.orderIdText}>Order #{currentOrder.id.slice(-6)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Status Section */}
                    <View style={styles.statusCard}>
                        <View style={styles.etaContainer}>
                            <Text style={styles.etaLabel}>Estimated Arrival</Text>
                            <Text style={styles.etaTime}>15-20 Mins</Text>
                        </View>
                        <View style={styles.divider} />
                        {renderTimeline()}
                    </View>

                    {/* Order Details */}
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>Order Details</Text>
                        {currentOrder.items.map((item, idx) => (
                            <View key={idx} style={styles.itemRow}>
                                <View style={styles.itemQuantityBadge}>
                                    <Text style={styles.itemQuantityText}>{item.quantity}x</Text>
                                </View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                            </View>
                        ))}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Paid</Text>
                            <Text style={styles.totalValue}>{formatPrice(currentOrder.totalAmount)}</Text>
                        </View>
                    </View>

                    {/* Support Actions */}
                    <TouchableOpacity style={styles.supportButton}>
                        <Ionicons name="call-outline" size={20} color={colors.primary[600]} />
                        <Text style={styles.supportButtonText}>Call Delivery Partner</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
        padding: spacing.xl,
    },
    emptyTitle: {
        ...textStyles.h3,
        color: colors.text.primary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    } as any,
    emptyText: {
        ...textStyles.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    homeButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
    },
    homeButtonText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
    },
    mapPlaceholder: {
        height: 250,
        backgroundColor: colors.gray[200],
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    headerFloating: {
        position: 'absolute',
        left: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.white,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    orderIdBadge: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        ...shadow.soft,
    },
    orderIdText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    contentContainer: {
        flex: 1,
        marginTop: -40,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    statusCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadow.medium,
        marginBottom: spacing.lg,
    },
    etaContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    etaLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
        marginBottom: 4,
    },
    etaTime: {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginBottom: spacing.lg,
    },
    timelineContainer: {
        paddingLeft: spacing.xs,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
        minHeight: 70,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 24,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    timelineDotActive: {
        backgroundColor: colors.success,
    },
    timelineDotCurrent: {
        backgroundColor: colors.primary[500],
        transform: [{ scale: 1.1 }],
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: colors.gray[200],
        marginVertical: 4,
    },
    timelineLineActive: {
        backgroundColor: colors.success,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: spacing.lg,
    },
    timelineLabel: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.semibold,
        color: colors.gray[400],
        marginBottom: 2,
    },
    timelineLabelActive: {
        color: colors.text.primary,
    },
    timelineDesc: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
    },
    cancelledCard: {
        alignItems: 'center',
        padding: spacing.lg,
    },
    cancelledTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.error,
        marginTop: spacing.md,
    },
    cancelledText: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[600],
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    detailsCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadow.soft,
        marginBottom: spacing.lg,
    },
    detailsTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    itemQuantityBadge: {
        backgroundColor: colors.primary[50],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: spacing.md,
    },
    itemQuantityText: {
        color: colors.primary[700],
        fontWeight: '700',
        fontSize: 12,
    },
    itemName: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    itemPrice: {
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
        marginTop: spacing.xs,
    },
    totalLabel: {
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    totalValue: {
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
        fontSize: typography.fontSize.lg,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.primary[200],
        gap: spacing.sm,
    },
    supportButtonText: {
        fontFamily: typography.fontFamily.semibold,
        color: colors.primary[600],
        fontSize: typography.fontSize.base,
    },
});

export default TrackOrderScreen;
