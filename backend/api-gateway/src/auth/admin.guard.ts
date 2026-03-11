import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Set by AuthGuard/JWT Strategy

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Check for admin email or admin role
        const isAdmin =
            user.email === 'admin@gmail.com' ||
            user.userType === 'admin' ||
            user.role === 'admin';

        if (!isAdmin) {
            throw new ForbiddenException('Admin access required');
        }

        return true;
    }
}
