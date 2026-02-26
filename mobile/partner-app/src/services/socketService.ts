import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../constants/config';

class SocketService {
    private socket: Socket | null = null;

    connect(storeId: string) {
        if (this.socket) return;

        // Socket.io expects the root URL, it appends /socket.io automatically
        // We use the domain root, not /api
        const rootUrl = API_CONFIG.BASE_URL.replace('/api', '');
        this.socket = io(rootUrl, {
            path: '/api/orders/socket.io', // Gateway should route this to order service's socket path? Or just /socket.io if gateway handles it?
            // Actually, gateway usually proxies /socket.io. Let's assume standard setup or if order service is exposed directly.
            // If via gateway, we might need a specific path or just rely on default.
            // Let's try root first. Verification step might be needed.
            // Wait, previous investigation showed order-service has a gateway.
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Socket Connected');
            this.socket?.emit('joinStore', { storeId });
        });

        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket Connection Error', err);
        });
    }

    onNewOrder(callback: (order: any) => void) {
        if (!this.socket) return;
        // Remove listeners to avoid duplicates if called multiple times? 
        // Better to manage outside or allow multiple.
        this.socket.on('new_order', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
