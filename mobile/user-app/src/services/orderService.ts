import { api } from './api';
import { API_CONFIG } from '../constants/config';
import { Order, OrderTracking } from '../types/order';

/**
 * Order Service
 */

export const orderService = {
  // Get all orders
  async getOrders(): Promise<Order[]> {
    return api.get<Order[]>(API_CONFIG.ENDPOINTS.ORDERS_MINE);
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order> {
    return api.get<Order>(API_CONFIG.ENDPOINTS.ORDER_DETAIL(id));
  },

  // Create order
  async createOrder(orderData: any): Promise<Order> {
    return api.post<Order>(API_CONFIG.ENDPOINTS.CREATE_ORDER, orderData);
  },

  // Track order
  async trackOrder(id: string): Promise<OrderTracking> {
    return api.get<OrderTracking>(API_CONFIG.ENDPOINTS.TRACK_ORDER(id));
  },
};

export default orderService;
