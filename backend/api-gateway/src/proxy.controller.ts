import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

@Controller()
export class ProxyController {
  private proxy = httpProxy.createProxyServer({});

  @All('*')
  handleProxy(@Req() req: Request, @Res() res: Response) {
    const hostname = req.hostname;
    
    // Route based on hostname
    if (hostname === 'api.bluecratefoods.com') {
      // This is an API request - continue with normal API Gateway handling
      res.status(404).json({ 
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
      // Unknown hostname
      res.status(400).json({ 
        error: 'Invalid hostname',
        hostname: hostname 
      });
    }
  }
}
