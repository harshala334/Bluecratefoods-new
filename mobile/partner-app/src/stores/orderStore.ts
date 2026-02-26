import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { api } from '../services/api';
import { API_CONFIG } from '../constants/config';
import { socketService } from '../services/socketService';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED' | 'READY_FOR_PICKUP';

export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number; // Changed from total to match backend
    status: OrderStatus;
    createdAt: string; // Changed from number to string (ISO)
    storeId: string;
}

interface OrderState {
    orders: Order[];

    // Actions
    initializeSocket: (storeId: string) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    loadOrders: (storeId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],

    initializeSocket: (storeId: string) => {
        socketService.connect(storeId);

        socketService.onNewOrder((newOrder: Order) => {
            console.log('Received new order:', newOrder);
            set((state) => ({
                orders: [newOrder, ...state.orders]
            }));
        });
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            await api.patch(API_CONFIG.ENDPOINTS.UPDATE_STATUS(orderId), { status });

            // Optimistic update
            set((state) => ({
                orders: state.orders.map(o =>
                    o.id === orderId ? { ...o, status } : o
                )
            }));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    },

    loadOrders: async (storeId: string) => {
        try {
            const response = await api.get<Order[]>(API_CONFIG.ENDPOINTS.ORDERS_STORE(storeId));
            set({ orders: response.data });
        } catch (error) {
            console.error('Failed to load orders', error);
        }
    },
}));
