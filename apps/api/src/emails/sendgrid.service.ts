import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { EmailEventType } from '@prisma/client';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class SendGridService {
  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService,
  ) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(emailData: {
    to: string;
    subject: string;
    content: string;
    leadId?: string;
  }) {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    const fromName = this.configService.get<string>('SENDGRID_FROM_NAME');

    const msg = {
      to: emailData.to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: emailData.subject,
      html: emailData.content,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    };

    try {
      const [response] = await sgMail.send(msg);
      
      // Update email record if leadId provided
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            sendgridMessageId: response.headers['x-message-id'],
          },
        });
      }

      return {
        success: true,
        messageId: response.headers['x-message-id'],
      };
    } catch (error) {
      console.error('SendGrid error:', error);
      
      // Update email record as failed
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: { status: 'FAILED' },
        });
      }

      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleWebhook(events: any[]) {
    for (const event of events) {
      try {
        await this.processWebhookEvent(event);
      } catch (error) {
        console.error('Webhook processing error:', error);
      }
    }
  }

  private async processWebhookEvent(event: any) {
    const { event: eventType, sg_message_id, timestamp } = event;

    if (!sg_message_id) return;

    // Find email by SendGrid message ID
    const email = await this.database.client.email.findFirst({
      where: { sendgridMessageId: sg_message_id },
    });

    if (!email) return;

    // Create email event record
    await this.database.client.emailEvent.create({
      data: {
        emailId: email.id,
        eventType: this.mapEventType(eventType),
        timestamp: new Date(timestamp * 1000),
        eventData: event,
      },
    });

    // Update email status for certain events
    if (eventType === 'delivered') {
      await this.database.client.email.update({
        where: { id: email.id },
        data: { status: 'DELIVERED' },
      });
    } else if (eventType === 'bounce') {
      await this.database.client.email.update({
        where: { id: email.id },
        data: { status: 'BOUNCED' },
      });
    }
  }

  private mapEventType(sgEventType: string): EmailEventType {
    const eventMapping: Record<string, EmailEventType> = {
      delivered: 'DELIVERED',
      open: 'OPENED',
      click: 'CLICKED',
      bounce: 'BOUNCED',
      dropped: 'DROPPED',
      spamreport: 'SPAM_REPORT',
      unsubscribe: 'UNSUBSCRIBE',
      deferred: 'DEFERRED',
      processed: 'PROCESSED',
    };

    return eventMapping[sgEventType] || 'PROCESSED';
  }
}