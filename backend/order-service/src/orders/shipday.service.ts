import { Injectable, Logger } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class ShipdayService {
    private readonly logger = new Logger(ShipdayService.name);
    private readonly apiKey = process.env.SHIPDAY_API_KEY;
    private readonly baseUrl = 'https://api.shipday.com';

    async createOrder(order: Order) {
        if (!this.apiKey) {
            this.logger.warn('SHIPDAY_API_KEY not set. Skipping delivery sync.');
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: order.id,
                    customerName: order.customerName || 'Customer',
                    customerAddress: order.address,
                    customerPhoneNumber: order.phone || '',
                    customerEmail: order.userEmail || '',
                    // You can add more mapping here (restaurantName, restaurantAddress, etc.)
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                this.logger.error(`Shipday API Error: ${response.status} - ${errorBody}`);
                return null;
            }

            const data = await response.json();
            this.logger.log(`Order synced to Shipday: ${order.id}`);
            return data;
        } catch (error) {
            this.logger.error(`Order sync to Shipday failed: ${error.message}`);
            return null;
        }
    }
}
