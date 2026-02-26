import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderStore } from '../../stores/orderStore';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { formatPrice } from '../../utils/formatters';

const OrderItem = ({ order, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.header}>
            <Text style={styles.storeName}>Store #{order.storeId || 'N/A'}</Text>
            <Text style={[styles.status, { color: getStatusColor(order.status) }]}>{order.status}</Text>
        </View>
        <View style={styles.details}>
            <Text style={styles.itemCount}>{order.items.length} items</Text>
            <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
        </View>
        <Text style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</Text>
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

export const MyOrdersScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { orders, loadOrders } = useOrderStore();

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>My Orders</Text>
            </View>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderItem
                        order={item}
                        onPress={() => navigation.navigate('TrackOrder', { orderId: item.id })}
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
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    storeName: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    status: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.bold,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    itemCount: {
        color: colors.gray[600],
    },
    total: {
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[400],
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.gray[500],
        fontSize: typography.fontSize.base,
    },
});
