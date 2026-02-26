import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('stores')
export class StoresProxyController {
    private serviceUrl = 'http://store-service:8004';

    @All('*')
    async handleProxy(@Req() req: Request, @Res() res: Response) {
        try {
            // Assume store service also has global prefix
            let path = req.originalUrl;
            if (!path.startsWith('/api')) {
                path = '/api' + path;
            }
            const targetUrl = `${this.serviceUrl}${path}`;

            console.log(`Proxying Store: ${req.method} ${path} -> ${targetUrl}`);

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
            console.error('Store proxy error:', error.message);
            res.status(502).json({ error: 'Store service unavailable', details: error.message });
        }
    }
}
