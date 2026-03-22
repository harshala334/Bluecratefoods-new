import { Controller, All, Req, Res, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthProxyController {
  private authServiceUrl = process.env.AUTH_SERVICE_URL || 'https://auth-service-441546178642.us-central1.run.app';

  @All('*')
  async handleAuthProxy(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract just the path after /auth from the original URL
      // originalUrl example: /api/auth/signup
      // We want to send to: http://auth-service:8001/api/auth/signup
      const path = req.originalUrl;
      const targetUrl = `${this.authServiceUrl}${path}`;

      console.log(`Proxying: ${req.method} ${path} -> ${targetUrl}`);
      console.log(`Request body:`, JSON.stringify(req.body));

      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined,
        headers: {
          'content-type': 'application/json',
          ...(req.headers.authorization ? { 'authorization': req.headers.authorization } : {}),
        },
        timeout: 30000,
        validateStatus: () => true
      });

      console.log(`Response status: ${response.status}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Auth proxy error:', error.message);
      res.status(502).json({ error: 'Auth service unavailable', details: error.message });
    }
  }
}
