import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('users')
export class UsersProxyController {
    private serviceUrl = process.env.USER_SERVICE_URL || 'https://user-service-hvu2slk4pa-uc.a.run.app';

    @All('*')
    async handleProxy(@Req() req: Request, @Res() res: Response) {
        try {
            // Force prepend /api because user-service has global prefix 'api'
            let path = req.originalUrl;
            if (!path.startsWith('/api')) {
                path = '/api' + path;
            }
            const targetUrl = `${this.serviceUrl}${path}`;

            console.log(`Proxying User: ${req.method} ${path} -> ${targetUrl}`);

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
            console.error('User proxy error:', error.message);
            res.status(502).json({ error: 'User service unavailable', details: error.message });
        }
    }
}
