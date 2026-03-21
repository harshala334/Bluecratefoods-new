import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, headers } = req;
        console.log(`[AuthMiddleware] Incoming: ${method} ${originalUrl}`);
        const authHeader = headers.authorization;
        if (authHeader) {
            console.log(`[AuthMiddleware] Auth Header found: ${authHeader.substring(0, 15)}...`);
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                try {
                    const decoded = jwt.decode(token);
                    console.log(`[AuthMiddleware] Decoded: ${(decoded as any)?.email}, Role: ${(decoded as any)?.userType}, Cat: ${(decoded as any)?.vendorCategory}`);
                    (req as any).user = decoded;
                } catch (error) {
                    console.error('[AuthMiddleware] JWT decode error:', error.message);
                }
            }
        } else {
            console.log('[AuthMiddleware] NO auth header');
        }
        next();
    }
}
