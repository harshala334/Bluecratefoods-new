import { Controller, All, Req, Res, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

@Controller()
export class ProxyController {
  private proxy = httpProxy.createProxyServer({});

  @All('*')
  handleProxy(@Req() req: Request, @Res() res: Response) {
    const hostname = req.hostname;
    const path = req.path;
    
    // Route based on hostname
    if (hostname.includes('api.bluecratefoods.com') || hostname.includes('run.app')) {
      // This is an API request - let other controllers handle it OR return 404 if not matched
      // Note: NestJS will hit more specific routes first. If it reached here, it didn't match products/auth etc.
      return res.status(404).json({ 
        message: 'API Gateway - Route not found',
        hostname: hostname,
        path: req.path 
      });
    } else if (hostname === 'bluecratefoods.com' || hostname === 'www.bluecratefoods.com') {
      // Proxy to NextJS frontend
      this.proxy.web(req, res, {
        target: 'http://nextjs-client:3000',
        changeOrigin: true,
      }, (err) => {
        if (err) {
          console.error('Proxy error:', err);
          res.status(502).json({ error: 'Bad Gateway' });
        }
      });
    } else {
      // Default fallback for other hostnames (like local testing)
      // If we are on localhost, still return 404 instead of 400
      res.status(404).json({ 
        message: 'API Gateway - Path not matched',
        hostname: hostname,
        path: req.path
      });
    }
  }
}
