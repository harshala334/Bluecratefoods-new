import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('stores')
export class StoresProxyController {
    private serviceUrl = process.env.STORE_SERVICE_URL || 'https://store-service-hvu2slk4pa-uc.a.run.app';

    @All('*')
    async handleProxy(@Req() req: Request, @Res() res: Response) {
        try {
            // store-service does NOT have global prefix 'api'
            const path = req.originalUrl.replace(/^\/api/, '');
            const targetUrl = `${this.serviceUrl}${path}`;

            console.log(`Proxying Store: ${req.method} ${path} -> ${targetUrl}`);

            const response = await axios({
                method: req.method,
                url: targetUrl,
                data: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined,
                headers: {
                    'content-type': 'application/json',
                    ...(req.headers.authorization ? { 'authorization': req.headers.authorization } : {}),
                },
                timeout: 10000,
                validateStatus: () => true
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            console.error('Store proxy error:', error.message);
            res.status(502).json({ error: 'Store service unavailable', details: error.message });
        }
    }
}
