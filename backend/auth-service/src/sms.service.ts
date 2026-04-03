import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly authKey = process.env.MSG91_AUTH_KEY || '502815ANZRaWE8Hul69c38bffP1';
  private readonly templateId = process.env.MSG91_OTP_TEMPLATE_ID || ''; // Placeholder until user gets PE ID approved

  async sendOtp(phone: string): Promise<boolean> {
    // TEST BYPASS: Always allow this number for App Store / Play Store reviews
    if (phone === '+919999999999' || phone === '9999999999') {
      this.logger.log(`[TEST BYPASS] Skipping real SMS for test number ${phone}.`);
      return true;
    }

    // DEVELOPMENT MODE: If templateId is missing, just log the OTP for testing
    if (!this.templateId || this.templateId === '') {
      this.logger.warn(`[DEV MODE] No MSG91 Template ID found. Skipping real SMS for ${phone}.`);
      this.logger.log(`[AUTH] Imagine an OTP was sent to ${phone}. You can verify it using any code if we bypass verifyOtp.`);
      return true; // Return true so the frontend thinks it was sent
    }

    try {
      // MSG91 v5 API for OTP - explicitly set expiry to 2 minutes
      const url = `https://control.msg91.com/api/v5/otp?template_id=${this.templateId}&mobile=${phone}&authkey=${this.authKey}&otp_expiry=2`;
      
      const response = await axios.get(url);
      
      if (response.data.type === 'success') {
        this.logger.log(`OTP sent successfully to ${phone}`);
        return true;
      } else {
        this.logger.error(`Failed to send OTP to ${phone}: ${response.data.message}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error calling MSG91 send API: ${error.message}`);
      return false;
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    // TEST BYPASS: Always allow 1234 for this number for App Store / Play Store reviews
    if ((phone === '+919999999999' || phone === '9999999999') && otp === '1234') {
      this.logger.log(`[TEST BYPASS] Verified OTP 1234 for test number ${phone}.`);
      return true;
    }

    // DEVELOPMENT MODE: If templateId is missing, allow a fixed OTP code like 1234 for testing
    if ((!this.templateId || this.templateId === '') && otp === '1234') {
      this.logger.warn(`[DEV MODE] Verified OTP 1234 for ${phone} as a bypass.`);
      return true;
    }

    try {
      // MSG91 v5 API for OTP Verify
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${phone}&authkey=${this.authKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.type === 'success') {
        this.logger.log(`OTP verified successfully for ${phone}`);
        return true;
      } else {
        this.logger.warn(`OTP verification failed for ${phone}: ${response.data.message}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error calling MSG91 verify API: ${error.message}`);
      return false;
    }
  }
}
