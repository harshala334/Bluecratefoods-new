import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Partner Dashboard Screen
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../constants/colors';
import { spacing, borderRadius } from '../constants/spacing';
import { typography } from '../constants/typography';
import { formatPrice } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { restaurant, logout } = useAuthStore();
    const { orders, loadOrders, updateOrderStatus, initializeSocket } = useOrderStore();

    // Derived states
    // In original code, 'orders' was used directly. Let's alias it to match the view code below or update variables.
    // The view expects: restaurantOrders, pendingOrders, activeOrders, completedOrders
    const restaurantOrders = orders;
    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const activeOrders = orders.filter(o => ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status));
    const completedOrders = orders.filter(o => ['COMPLETED', 'CANCELLED'].includes(o.status));

    // Calculate metrics based on current session
    const stats = {
        todayOrders: orders.length,
        todayRevenue: orders.reduce((acc, order) => acc + order.totalAmount, 0),
        pendingOrders: activeOrders.length,
        rating: 4.8 // Hardcoded for now
    };

    useEffect(() => {
        if (restaurant?.id) {
            loadOrders(restaurant.id);
            initializeSocket(restaurant.id);
        }
    }, [restaurant?.id]);

    const handleAcceptOrder = async (orderId: string) => {
        await updateOrderStatus(orderId, 'CONFIRMED');
    };

    const handleReadyOrder = async (orderId: string) => {
        await updateOrderStatus(orderId, 'READY_FOR_PICKUP');
    };

    // Helper to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return colors.warning;
            case 'CONFIRMED': return colors.info;
            case 'PREPARING': return colors.warning;
            case 'READY_FOR_PICKUP': return colors.success;
            case 'COMPLETED': return colors.success;
            case 'CANCELLED': return colors.error;
            default: return colors.gray[500];
        }
    };

    const handleStatusUpdate = (orderId: string, status: any) => {
        updateOrderStatus(orderId, status);
    };

    const OrderCard = ({ order, showActions = false }: { order: any, showActions?: boolean }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                    <Text style={styles.orderTime}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.customerInfo}>
                <Text style={styles.customerName}>Guest User</Text>
                <Text style={styles.customerAddress} numberOfLines={1}>Table 1</Text>
            </View>

            <View style={styles.itemList}>
                {order.items.map((item: any, idx: number) => (
                    <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Bill</Text>
                <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
            </View>

            {showActions && order.status === 'PENDING' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleStatusUpdate(order.id, 'CANCELLED')}
                    >
                        <Text style={[styles.actionButtonText, styles.rejectText]}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                    >
                        <Text style={[styles.actionButtonText, styles.acceptText]}>Accept Order</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showActions && order.status === 'CONFIRMED' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.readyButton]}
                        onPress={() => handleStatusUpdate(order.id, 'PREPARING')}
                    >
                        <Text style={styles.actionButtonText}>Start Preparing</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showActions && order.status === 'PREPARING' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.readyButton]}
                        onPress={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
                    >
                        <Text style={styles.actionButtonText}>Mark Ready</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showActions && order.status === 'READY_FOR_PICKUP' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleStatusUpdate(order.id, 'COMPLETED')}
                    >
                        <Text style={styles.actionButtonText}>Complete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, Chef!</Text>
                    <Text style={styles.restaurantName}>{restaurant?.name || 'My Kitchen'}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.profileButton}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80' }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {restaurantOrders.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>No Active Orders</Text>
                        <Text style={styles.emptyStateText}>
                            Orders will appear here when customers place them.
                            {"\n"}
                            (Tap "+ Demo Order" to simulate)
                        </Text>
                    </View>
                )}

                {pendingOrders.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>New Orders</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{pendingOrders.length}</Text>
                            </View>
                        </View>
                        {pendingOrders.map(order => (
                            <OrderCard key={order.id} order={order} showActions={true} />
                        ))}
                    </View>
                )}

                {activeOrders.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>In Kitchen</Text>
                        {activeOrders.map(order => (
                            <OrderCard key={order.id} order={order} showActions={true} />
                        ))}
                    </View>
                )}

                {completedOrders.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Past Orders</Text>
                        {completedOrders.slice(0, 3).map(order => (
                            <OrderCard key={order.id} order={order} showActions={false} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return colors.warning; // Orange/Yellow
        case 'PREPARING': return '#3B82F6'; // Blue
        case 'READY': return '#10B981'; // Green
        case 'COMPLETED': return colors.gray[500];
        case 'CANCELLED': return colors.error;
        default: return colors.gray[500];
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray bg for dashboard feel
    },
    header: {
        backgroundColor: colors.primary[900], // Dark header for "Admin" feel
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: colors.white,
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
    },
    backButton: {
        padding: spacing.sm,
    },
    backButtonText: {
        color: colors.gray[300],
        fontSize: typography.fontSize.sm,
    },
    logoutButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    logoutButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: typography.fontSize.sm,
    },
    headerSubtitle: {
        color: colors.gray[300],
        fontSize: typography.fontSize.sm,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: spacing.xl,
    },
    emptyStateTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: 'bold',
        color: colors.gray[400],
        marginBottom: spacing.sm,
    },
    emptyStateText: {
        fontSize: typography.fontSize.base,
        color: colors.gray[400],
        textAlign: 'center',
        lineHeight: 24,
    },
    scrollContent: {
        padding: spacing.md,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    badge: {
        backgroundColor: colors.error,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    orderId: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    orderTime: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[500],
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginVertical: spacing.sm,
    },
    customerInfo: {
        marginBottom: spacing.sm,
    },
    customerName: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.semibold,
        color: colors.text.primary,
    },
    customerAddress: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
    },
    itemList: {
        marginBottom: spacing.sm,
    },
    itemRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    itemQuantity: {
        fontWeight: 'bold',
        width: 30,
        color: colors.primary[700],
    },
    itemName: {
        flex: 1,
        color: colors.text.primary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
        marginTop: spacing.sm,
    },
    totalLabel: {
        fontWeight: '600',
        color: colors.gray[600],
    },
    totalValue: {
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    actionButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: colors.primary[500],
    },
    rejectButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.error,
    },
    readyButton: {
        backgroundColor: '#10B981', // green
    },
    completeButton: {
        backgroundColor: colors.gray[800],
    },
    actionButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
    acceptText: {
        color: colors.white,
    },
    // ... (previous styles)
    rejectText: {
        color: colors.error,
    },
    // Missing styles added:
    restaurantName: {
        color: colors.gray[300],
        fontSize: typography.fontSize.sm,
    },
    greeting: {
        color: colors.white,
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
    },
    profileButton: {
        padding: spacing.xs,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
    },
    itemPrice: {
        fontWeight: 'bold',
        width: 80,
        textAlign: 'right',
        color: colors.text.primary,
    },
});

export default DashboardScreen;
