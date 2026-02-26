import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './enquiry.entity';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EnquiryService {
    constructor(
        @InjectRepository(Enquiry)
        private enquiryRepository: Repository<Enquiry>,
    ) {
        // Initialize SendGrid
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }
    }

    async create(enquiryData: Partial<Enquiry>): Promise<Enquiry> {
        // 1. Save to Database
        const enquiry = this.enquiryRepository.create(enquiryData);
        const savedEnquiry = await this.enquiryRepository.save(enquiry);

        // 2. Send Email Notification (non-blocking)
        this.sendEmail(savedEnquiry).catch(err =>
            console.error('Failed to send email notification:', err)
        );

        return savedEnquiry;
    }

    private async sendEmail(enquiry: Enquiry) {
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('SendGrid API key not found. Skipping email notification.');
            return;
        }

        const recipients = process.env.ENQUIRY_RECIPIENTS || 'soumikmajumdar00@gmail.com,mharshala334@gmail.com';
        const recipientList = recipients.split(',').map(email => email.trim());

        // 1. Send Notification to Admins
        const adminMsg = {
            to: recipientList,
            from: 'noreply@bluecratefoods.com', // Use noreply for internal notifications to avoid self-send spam blocks
            replyTo: enquiry.email, // Allow admins to reply directly to the customer
            subject: `New B2B Enquiry from ${enquiry.name}`,
            text: `
New Enquiry Received:

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Message: ${enquiry.message || 'No message provided'}

Time: ${enquiry.createdAt}
      `,
            html: `
<h2>New Enquiry Received</h2>
<p><strong>Name:</strong> ${enquiry.name}</p>
<p><strong>Email:</strong> ${enquiry.email}</p>
<p><strong>Phone:</strong> ${enquiry.phone}</p>
<p><strong>Message:</strong> ${enquiry.message || 'No message provided'}</p>
<p><strong>Time:</strong> ${enquiry.createdAt}</p>
      `,
        };

        try {
            await sgMail.send(adminMsg);
            console.log(`Email notification sent to: ${recipients}`);
        } catch (error) {
            console.error('Error sending admin email:', error.response?.body || error);
        }

        // 2. Send Confirmation to User
        if (enquiry.email) {
            const userMsg = {
                to: enquiry.email,
                from: process.env.EMAIL_FROM || 'noreply@bluecratefoods.com',
                subject: 'Enquiry Received - BlueCrateFoods',
                text: `
Thank you for reaching out to us, ${enquiry.name}. Our representative will reach out to you shortly. If you are looking for urgent support kindly reach out to 9591890828.

Best regards,
BlueCrateFoods Team
                `,
                html: `
<p>Thank you for reaching out to us, ${enquiry.name}.</p>
<p>Our representative will reach out to you shortly. If you are looking for urgent support kindly reach out to 9591890828.</p>
<p>Best regards,<br>BlueCrateFoods Team</p>
                `,
            };

            try {
                await sgMail.send(userMsg);
                console.log(`Confirmation email sent to user: ${enquiry.email}`);
            } catch (error) {
                console.error('Error sending user confirmation email:', error.response?.body || error);
            }
        }
    }
}
