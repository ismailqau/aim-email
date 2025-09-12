/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: quaid@live.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class SmtpService {
  private readonly logger = new Logger(SmtpService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE') || false;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn(
        'SMTP configuration is incomplete. SMTP service will not be available.'
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });

      this.logger.log(
        `SMTP transporter initialized for ${smtpHost}:${smtpPort}`
      );
    } catch (error) {
      this.logger.error('Failed to initialize SMTP transporter:', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      this.logger.error('SMTP verification failed:', error);
      return false;
    }
  }

  async sendEmail(emailData: {
    to: string;
    subject: string;
    content: string;
    leadId?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'SMTP transporter not initialized. Check SMTP configuration.',
      };
    }

    const fromEmail =
      this.configService.get<string>('SMTP_FROM_EMAIL') ||
      this.configService.get<string>('SMTP_USER');
    const fromName =
      this.configService.get<string>('SMTP_FROM_NAME') ||
      'AI Email Marketing System';

    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.content,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      // Update email record if leadId provided
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            sendgridMessageId: info.messageId, // Store SMTP messageId in same field
          },
        });
      }

      this.logger.log(
        `Email sent successfully via SMTP to ${emailData.to}. MessageId: ${info.messageId}`
      );

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error('SMTP email sending failed:', error);

      // Update email record as failed
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: { status: 'FAILED' },
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMTP error',
      };
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.transporter) {
      return {
        success: false,
        message: 'SMTP transporter not initialized. Check configuration.',
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'SMTP connection verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
