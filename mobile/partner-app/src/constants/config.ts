import { Platform } from 'react-native';

export const API_CONFIG = {
    // Partner app interacts directly with Order Service (for Websockets support)
    // Use LAN IP for mixed Device/Emulator support
    BASE_URL: 'https://api.bluecratefoods.com/api',
    ENDPOINTS: {
        ORDERS_STORE: (storeId: string) => `/orders/store/${storeId}`,
        UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    }
};
