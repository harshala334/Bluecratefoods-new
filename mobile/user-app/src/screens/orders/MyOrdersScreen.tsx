import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderStore } from '../../stores/orderStore';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { formatPrice } from '../../utils/formatters';

const OrderItem = ({ order, onPress, onReorder }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
            <View>
                <Text style={styles.storeName}>Order #{order.id.slice(-6).toUpperCase()}</Text>
                <Text style={styles.date}>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Text style={[styles.status, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
        </View>
        
        <View style={styles.divider} />

        <View style={styles.details}>
            <View style={styles.itemsList}>
                {order.items.slice(0, 2).map((item: any, idx: number) => (
                    <Text key={idx} style={styles.itemName} numberOfLines={1}>
                        {item.quantity}x {item.name}
                    </Text>
                ))}
                {order.items.length > 2 && (
                    <Text style={styles.moreItems}>+ {order.items.length - 2} more items</Text>
                )}
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
            </View>
        </View>

        <View style={styles.actions}>
            <TouchableOpacity 
                style={styles.reorderButton} 
                onPress={(e) => {
                    e.stopPropagation();
                    onReorder(order);
                }}
            >
                <Feather name="refresh-cw" size={14} color={colors.primary[600]} />
                <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
            <Feather name="chevron-right" size={20} color={colors.gray[400]} />
        </View>
    </TouchableOpacity>
);

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return colors.warning;
        case 'CONFIRMED': return colors.info;
        case 'PREPARING': return colors.warning;
        case 'READY_FOR_PICKUP': return colors.success;
        case 'COMPLETED': return colors.success;
        case 'CANCELLED': return colors.error;
        default: return colors.gray[600];
    }
};

import useAuthStore from '../../stores/authStore';

export const MyOrdersScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { orders, loadOrders, reorder } = useOrderStore();
    const { isGuest, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isGuest && isAuthenticated) {
            loadOrders();
        }
    }, [isGuest, isAuthenticated]);

    if (isGuest || !isAuthenticated) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Order History</Text>
                </View>
                <View style={styles.guestContainer}>
                    <View style={styles.guestIconCircle}>
                        <Feather name="package" size={60} color={colors.primary[500]} />
                    </View>
                    <Text style={styles.guestTitle}>Track Your Orders</Text>
                    <Text style={styles.guestSubtitle}>Login to see your past orders and track active ones.</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>Login Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleReorder = async (order: any) => {
        try {
            await reorder(order);
            navigation.navigate('Cart');
        } catch (error) {
            console.error('Reorder error:', error);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Order History</Text>
            </View>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderItem
                        order={item}
                        onPress={() => navigation.navigate('TrackOrder', { orderId: item.id })}
                        onReorder={handleReorder}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    headerContainer: {
        padding: spacing.lg,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    listContent: {
        padding: spacing.lg,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow.soft,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    storeName: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    status: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[50],
        marginBottom: spacing.md,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.lg,
    },
    itemsList: {
        flex: 1,
    },
    itemName: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[600],
        fontFamily: typography.fontFamily.medium,
        marginBottom: 2,
    },
    moreItems: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[400],
        fontFamily: typography.fontFamily.medium,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 10,
        color: colors.gray[400],
        fontFamily: typography.fontFamily.bold,
        textTransform: 'uppercase',
    },
    total: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[400],
        fontFamily: typography.fontFamily.medium,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: borderRadius.lg,
        gap: 6,
    },
    reorderText: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.gray[500],
        fontSize: typography.fontSize.base,
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
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
