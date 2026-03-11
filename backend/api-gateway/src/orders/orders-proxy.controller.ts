import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('orders')
export class OrdersProxyController {
    private orderServiceUrl = process.env.ORDER_SERVICE_URL || 'https://order-service-hvu2slk4pa-uc.a.run.app';

    @All('*')
    async handleOrdersProxy(@Req() req: Request, @Res() res: Response) {
        try {
            // originalUrl: /api/orders/... or /orders/...
            // Gateway matches path 'orders', so we are good.
            // Target: http://order-service:8003/orders/...
            // Wait, if originalUrl is '/orders', and we append it to 'http://order-service:8003', do we get 'http://order-service:8003/orders'?
            // Yes. OrderService uses @Controller('orders'), so it expects /orders.

            // Stripping /api from the original URL so the target service gets /orders/...
            const path = req.originalUrl.replace(/^\/api/, '');
            const targetUrl = `${this.orderServiceUrl}${path}`;

            console.log(`Proxying Order: ${req.method} ${path} -> ${targetUrl}`);

            const response = await axios({
                method: req.method,
                url: targetUrl,
                data: req.body,
                headers: {
                    'content-type': 'application/json',
                    ...(req.headers.authorization ? { 'authorization': req.headers.authorization } : {}),
                },
                timeout: 10000,
                validateStatus: () => true
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            console.error('Order proxy error:', error.message);
            res.status(502).json({ error: 'Order service unavailable', details: error.message });
        }
    }
}
