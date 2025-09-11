import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from './sendgrid.service';
import { SmtpService } from './smtp.service';

export interface EmailData {
  to: string;
  subject: string;
  content: string;
  leadId?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: 'sendgrid' | 'smtp';
}

@Injectable()
export class EmailDeliveryService {
  private readonly logger = new Logger(EmailDeliveryService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sendGridService: SendGridService,
    private readonly smtpService: SmtpService,
  ) {}

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    // First try SendGrid if API key is available
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    
    if (sendGridApiKey && sendGridApiKey !== 'SG.your-actual-sendgrid-api-key') {
      try {
        this.logger.log('Attempting to send email via SendGrid...');
        const result = await this.sendGridService.sendEmail(emailData);
        
        if (result.success) {
          this.logger.log(`Email sent successfully via SendGrid to ${emailData.to}`);
          return {
            ...result,
            provider: 'sendgrid',
          };
        } else {
          this.logger.warn('SendGrid failed, falling back to SMTP...');
        }
      } catch (error) {
        this.logger.error('SendGrid error, falling back to SMTP:', error);
      }
    } else {
      this.logger.log('SendGrid API key not configured, using SMTP fallback...');
    }

    // Fallback to SMTP
    const smtpAvailable = await this.smtpService.isAvailable();
    if (!smtpAvailable) {
      return {
        success: false,
        error: 'Neither SendGrid nor SMTP is properly configured.',
      };
    }

    try {
      this.logger.log('Attempting to send email via SMTP...');
      const result = await this.smtpService.sendEmail(emailData);
      
      if (result.success) {
        this.logger.log(`Email sent successfully via SMTP to ${emailData.to}`);
      }
      
      return {
        ...result,
        provider: 'smtp',
      };
    } catch (error) {
      this.logger.error('SMTP sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMTP error',
      };
    }
  }

  async testEmailServices(): Promise<{
    sendgrid: { available: boolean; message: string };
    smtp: { available: boolean; message: string };
  }> {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    const sendGridAvailable = sendGridApiKey && sendGridApiKey !== 'SG.your-actual-sendgrid-api-key';
    
    const smtpTest = await this.smtpService.testConnection();
    
    return {
      sendgrid: {
        available: !!sendGridAvailable,
        message: sendGridAvailable ? 'SendGrid API key configured' : 'SendGrid API key not configured',
      },
      smtp: {
        available: smtpTest.success,
        message: smtpTest.message,
      },
    };
  }

  async getPreferredProvider(): Promise<'sendgrid' | 'smtp' | 'none'> {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    
    if (sendGridApiKey && sendGridApiKey !== 'SG.your-actual-sendgrid-api-key') {
      return 'sendgrid';
    }
    
    const smtpAvailable = await this.smtpService.isAvailable();
    if (smtpAvailable) {
      return 'smtp';
    }
    
    return 'none';
  }
}