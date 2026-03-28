import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private razorpay: any;

  constructor() { }

  private getRazorpay() {
    if (!this.razorpay) {
      const RazorpayLib = require('razorpay');
      const RazorpayClass = RazorpayLib.default || RazorpayLib;
      this.razorpay = new RazorpayClass({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
      });
    }
    return this.razorpay;
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    try {
      this.logger.log(`Creating Razorpay order for amount: ${amount} ${currency}`);
      
      const options = {
        amount: Math.round(amount * 100), // Razorpay accepts amount in paise (1 INR = 100 paise)
        currency,
        receipt,
      };

      const rzp = this.getRazorpay();
      const order = await rzp.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error: any) {
      this.logger.error(`Error creating Razorpay order: ${JSON.stringify(error)}`);
      this.logger.error(error);
      throw new Error('Could not create payment order');
    }
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    try {
      const rzp = this.getRazorpay();
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      this.logger.error(`Error verifying Razorpay signature: ${error.message}`);
      return false;
    }
  }
}
