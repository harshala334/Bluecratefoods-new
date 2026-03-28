import { Controller, Post, Body, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('auth/payment')
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-order')
    async createOrder(@Body() body: { amount: number; userId: string }) {
        this.logger.log(`Create order request for userId: ${body.userId}, amount: ${body.amount}`);
        // Razorpay receipt limit is 40 chars. Use short prefix + timestamp + partial userId.
        const shortId = body.userId.substring(0, 10);
        const receipt = `rcpt_${Date.now()}_${shortId}`;
        return this.paymentService.createOrder(body.amount, 'INR', receipt);
    }

    @Post('verify-signature')
    async verifySignature(
        @Body() body: { 
            orderId: string; 
            paymentId: string; 
            signature: string;
            userId: string;
            items: any[];
            amount: number;
        }
    ) {
        this.logger.log(`Verify signature request for orderId: ${body.orderId}`);
        const isValid = this.paymentService.verifySignature(
            body.orderId,
            body.paymentId,
            body.signature
        );

        if (!isValid) {
            throw new UnauthorizedException('Payment signature verification failed');
        }

        // HERE: In a real app, you would create the order in your database after verification
        this.logger.log(`Payment confirmed for orderId: ${body.orderId}. Releasing kitchen ticket...`);
        
        return { 
            success: true, 
            message: 'Payment verified and order confirmed' 
        };
    }
}
