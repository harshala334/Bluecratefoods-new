import { Address } from './user';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  storeId?: string; // Added to match backend
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress?: Address; // Made optional as backend might not return it yet
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  deliveryPartner?: DeliveryPartner;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  estimatedDeliveryTime: string;
  deliveryPartner?: DeliveryPartner;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}
