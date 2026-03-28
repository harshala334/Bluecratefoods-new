import { create } from 'zustand';
import { storage } from '../utils/storage';
import { CartItem } from '../types/cart';
import { orderService } from '../services/orderService';
import { useAuthStore } from './authStore';
import { Order, OrderStatus } from '../types/order';

interface OrderState {
    orders: Order[];
    activeOrders: Order[]; // Orders not yet completed for the user side
    restaurantOrders: Order[]; // Orders visible to the restaurant

    // Actions
    placeOrder: (items: CartItem[], total: number, customerDetails?: { name?: string; address?: string; phone?: string; email?: string }) => Promise<any>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    loadOrders: () => Promise<void>;
    reorder: (order: Order) => Promise<void>;
}

// Mock synchronous storage key
const STORAGE_KEY = '@bluecrate_orders';

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    activeOrders: [],
    restaurantOrders: [],

    placeOrder: async (items, total, customerDetails?: { name?: string; address?: string; phone?: string; email?: string }) => {
        try {
            const { user } = useAuthStore.getState();

            // Hardcoded for demo - in real app comes from Auth/Context
            const orderData = {
                storeId: 'store-1', // Default store
                items: items.map(item => ({
                    menuItemId: item.ingredient.id.toString(),
                    name: item.ingredient.name,
                    quantity: item.quantity,
                    price: item.ingredient.price
                })),
                totalAmount: total,
                customerName: customerDetails?.name || user?.name || 'Guest User',
                address: customerDetails?.address || '123, Green Street, Blue Crate Apartments',
                phone: customerDetails?.phone || '9876543210',
                userEmail: customerDetails?.email || user?.email || '',
            };

            const newOrder = await orderService.createOrder(orderData);

            // Refresh orders list
            await get().loadOrders();

            return newOrder;

        } catch (error) {
            console.error('Failed to place order:', error);
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            // This endpoint might be partner-only, but keeping for reference
            // await orderService.updateStatus(orderId, status);
            await get().loadOrders();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    },

    loadOrders: async () => {
        try {
            const storedOrders = await orderService.getOrders();
            if (storedOrders) {
                set({
                    orders: storedOrders,
                    activeOrders: storedOrders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)),
                    restaurantOrders: [], // User app doesn't need this
                });
            }
        } catch (error) {
            console.error('Failed to load orders', error);
        }
    },

    reorder: async (order) => {
        try {
            const { addItem, clearCart } = (await import('./cartStore')).useCartStore.getState();
            
            // Optional: Clear cart before reordering? 
            // Usually reorder means "I want exactly this again", but let's just append for flexibility
            // or ask user. For now, let's just add to existing cart.

            for (const item of order.items) {
                // We need to map order item to Ingredient type
                // In a real app, we'd fetch the full ingredient details from a product service
                // For now, we'll reconstruct a partial Ingredient object
                const ingredient = {
                    id: parseInt(item.menuItemId) || Math.random(),
                    name: item.name,
                    price: item.price,
                    image: '', // Placeholder
                    category: '',
                    unit: 'pcs'
                };
                await addItem(ingredient as any, item.quantity);
            }
        } catch (error) {
            console.error('Reorder failed:', error);
            throw error;
        }
    },
}));
