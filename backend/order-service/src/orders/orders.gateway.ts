import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class OrdersGateway {
    @WebSocketServer()
    server: Server;

    /**
     * Partner App joins a room specific to their storeId
     * Example: client.emit('joinStore', { storeId: 'store-1' })
     */
    @SubscribeMessage('joinStore')
    handleJoinStore(
        @MessageBody() data: { storeId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `store_${data.storeId}`;
        client.join(roomName);
        console.log(`Client ${client.id} joined room ${roomName}`);
        client.emit('joined', { room: roomName });
    }

    /**
     * Helper to emit new order event to a specific store room
     */
    notifyNewOrder(storeId: string, order: any) {
        const roomName = `store_${storeId}`;
        this.server.to(roomName).emit('new_order', order);
        console.log(`Emitted new_order to ${roomName}`);
    }
}
