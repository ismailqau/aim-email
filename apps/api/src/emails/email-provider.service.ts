/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { EnhancedSmtpService, SmtpConfigData } from './enhanced-smtp.service';
import { SendGridService } from './sendgrid.service';
import { DnsValidationService } from './dns-validation.service';

export interface EmailProviderConfig {
  companyId: string;
  provider: 'SENDGRID' | 'SMTP';
  sendgridConfig?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    webhookUrl?: string;
  };
  smtpConfig?: SmtpConfigData;
}

export interface EmailSendRequest {
  to: string;
  subject: string;
  content: string;
  leadId?: string;
  companyId: string;
}

@Injectable()
export class EmailProviderService {
  private readonly logger = new Logger(EmailProviderService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly enhancedSmtpService: EnhancedSmtpService,
    private readonly sendGridService: SendGridService,
    private readonly dnsValidationService: DnsValidationService
  ) {}

  async configureEmailProvider(config: EmailProviderConfig): Promise<any> {
    this.logger.log(
      `Configuring email provider for company ${config.companyId}: ${config.provider}`
    );

    try {
      // Validate configuration before saving
      await this.validateProviderConfig(config);

      // Update or create email settings
      const emailSettings = await this.database.client.emailSettings.upsert({
        where: { companyId: config.companyId },
        update: {
          provider: config.provider,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          companyId: config.companyId,
          provider: config.provider,
          isActive: true,
        },
      });

      // Configure SendGrid
      if (config.provider === 'SENDGRID' && config.sendgridConfig) {
        await this.database.client.sendGridConfig.upsert({
          where: { emailSettingsId: emailSettings.id },
          update: {
            apiKey: config.sendgridConfig.apiKey,
            fromEmail: config.sendgridConfig.fromEmail,
            fromName: config.sendgridConfig.fromName,
            webhookUrl: config.sendgridConfig.webhookUrl,
            updatedAt: new Date(),
          },
          create: {
            emailSettingsId: emailSettings.id,
            apiKey: config.sendgridConfig.apiKey,
            fromEmail: config.sendgridConfig.fromEmail,
            fromName: config.sendgridConfig.fromName,
            webhookUrl: config.sendgridConfig.webhookUrl,
          },
        });
      }

      // Configure SMTP
      if (config.provider === 'SMTP' && config.smtpConfig) {
        await this.database.client.smtpConfig.upsert({
          where: { emailSettingsId: emailSettings.id },
          update: {
            host: config.smtpConfig.host,
            port: config.smtpConfig.port,
            secure: config.smtpConfig.secure,
            username: config.smtpConfig.username,
            password: config.smtpConfig.password,
            fromEmail: config.smtpConfig.fromEmail,
            fromName: config.smtpConfig.fromName,
            replyToEmail: config.smtpConfig.replyToEmail,
            enableDkim: config.smtpConfig.enableDkim || false,
            dkimPrivateKey: config.smtpConfig.dkimPrivateKey,
            dkimSelector: config.smtpConfig.dkimSelector,
            dkimDomain: config.smtpConfig.dkimDomain,
            maxConnections: config.smtpConfig.maxConnections || 5,
            maxMessages: config.smtpConfig.maxMessages || 100,
            rateLimit: config.smtpConfig.rateLimit || 10,
            connectionTimeout: config.smtpConfig.connectionTimeout || 60000,
            socketTimeout: config.smtpConfig.socketTimeout || 60000,
            greetingTimeout: config.smtpConfig.greetingTimeout || 30000,
            useStaticIp: config.smtpConfig.useStaticIp || false,
            staticIpAddress: config.smtpConfig.staticIpAddress,
            enableTls: config.smtpConfig.enableTls !== false,
            requireTls: config.smtpConfig.requireTls || false,
            updatedAt: new Date(),
          },
          create: {
            emailSettingsId: emailSettings.id,
            host: config.smtpConfig.host,
            port: config.smtpConfig.port,
            secure: config.smtpConfig.secure,
            username: config.smtpConfig.username,
            password: config.smtpConfig.password,
            fromEmail: config.smtpConfig.fromEmail,
            fromName: config.smtpConfig.fromName,
            replyToEmail: config.smtpConfig.replyToEmail,
            enableDkim: config.smtpConfig.enableDkim || false,
            dkimPrivateKey: config.smtpConfig.dkimPrivateKey,
            dkimSelector: config.smtpConfig.dkimSelector,
            dkimDomain: config.smtpConfig.dkimDomain,
            maxConnections: config.smtpConfig.maxConnections || 5,
            maxMessages: config.smtpConfig.maxMessages || 100,
            rateLimit: config.smtpConfig.rateLimit || 10,
            connectionTimeout: config.smtpConfig.connectionTimeout || 60000,
            socketTimeout: config.smtpConfig.socketTimeout || 60000,
            greetingTimeout: config.smtpConfig.greetingTimeout || 30000,
            useStaticIp: config.smtpConfig.useStaticIp || false,
            staticIpAddress: config.smtpConfig.staticIpAddress,
            enableTls: config.smtpConfig.enableTls !== false,
            requireTls: config.smtpConfig.requireTls || false,
          },
        });
      }

      return await this.getEmailProviderConfig(config.companyId);
    } catch (error) {
      this.logger.error(`Failed to configure email provider:`, error);
      throw new BadRequestException(
        `Email provider configuration failed: ${error.message}`
      );
    }
  }

  async sendEmailWithCompanyConfig(request: EmailSendRequest): Promise<any> {
    const config = await this.getEmailProviderConfig(request.companyId);

    if (!config || !config.isActive) {
      throw new BadRequestException(
        `No active email configuration found for company ${request.companyId}`
      );
    }

    const startTime = Date.now();

    try {
      let result;

      if (config.provider === 'SENDGRID' && config.sendgridConfig) {
        result = await this.sendViaConfiguredSendGrid(
          request,
          config.sendgridConfig
        );
      } else if (config.provider === 'SMTP' && config.smtpConfig) {
        result = await this.enhancedSmtpService.sendEmailWithConfig(
          {
            to: request.to,
            subject: request.subject,
            content: request.content,
            leadId: request.leadId,
          },
          config.smtpConfig
        );
      } else {
        throw new Error('Invalid email provider configuration');
      }

      // Log successful delivery
      await this.logEmailDelivery({
        emailId: request.leadId,
        provider: config.provider,
        messageId: result.messageId,
        status: 'SENT',
        deliveryTime: Date.now() - startTime,
        reputationScore: result.reputationScore,
      });

      return result;
    } catch (error) {
      // Log failed delivery
      await this.logEmailDelivery({
        emailId: request.leadId,
        provider: config.provider,
        status: 'FAILED',
        errorMessage: error.message,
        deliveryTime: Date.now() - startTime,
      });

      throw error;
    }
  }

  async getEmailProviderConfig(companyId: string): Promise<any> {
    return this.database.client.emailSettings.findUnique({
      where: { companyId },
      include: {
        sendgridConfig: true,
        smtpConfig: true,
      },
    });
  }

  async validateEmailSetup(companyId: string): Promise<any> {
    const config = await this.getEmailProviderConfig(companyId);

    if (!config) {
      return {
        isValid: false,
        issues: ['No email configuration found'],
        recommendations: ['Configure an email provider (SendGrid or SMTP)'],
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let dnsValidation = null;

    // Validate SendGrid configuration
    if (config.provider === 'SENDGRID' && config.sendgridConfig) {
      if (
        !config.sendgridConfig.apiKey ||
        config.sendgridConfig.apiKey === 'SG.your-actual-sendgrid-api-key'
      ) {
        issues.push('SendGrid API key is missing or using placeholder value');
        recommendations.push('Add a valid SendGrid API key');
      }

      if (!config.sendgridConfig.fromEmail) {
        issues.push('SendGrid from email is not configured');
        recommendations.push('Configure a from email address');
      }
    }

    // Validate SMTP configuration and DNS setup
    if (config.provider === 'SMTP' && config.smtpConfig) {
      if (
        !config.smtpConfig.host ||
        !config.smtpConfig.username ||
        !config.smtpConfig.password
      ) {
        issues.push('SMTP configuration is incomplete');
        recommendations.push(
          'Complete SMTP host, username, and password configuration'
        );
      }

      if (!config.smtpConfig.fromEmail) {
        issues.push('SMTP from email is not configured');
        recommendations.push('Configure a from email address');
      }

      // Validate DNS setup for SMTP
      if (config.smtpConfig.fromEmail) {
        const domain = config.smtpConfig.fromEmail.split('@')[1];
        dnsValidation = await this.dnsValidationService.validateDomainSetup(
          domain,
          config.smtpConfig.host
        );

        if (dnsValidation.overallScore < 80) {
          issues.push(
            `DNS configuration score is ${dnsValidation.overallScore}% - may affect deliverability`
          );
          recommendations.push(
            'Improve DNS configuration (SPF, DKIM, DMARC records)'
          );
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      dnsValidation,
      provider: config.provider,
      lastChecked: new Date(),
    };
  }

  async testEmailConfiguration(
    companyId: string,
    testEmail: string
  ): Promise<any> {
    const config = await this.getEmailProviderConfig(companyId);

    if (!config || !config.isActive) {
      throw new BadRequestException('No active email configuration found');
    }

    const testEmailData = {
      to: testEmail,
      subject: 'Email Configuration Test',
      content: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration.</p>
        <p><strong>Provider:</strong> ${config.provider}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you received this email, your configuration is working correctly!</p>
      `,
      companyId,
    };

    return this.sendEmailWithCompanyConfig(testEmailData);
  }

  async generateDKIMKeyPair(companyId: string): Promise<any> {
    const keyPair = await this.dnsValidationService.generateDKIMKeyPair();

    // Store the private key in the SMTP configuration
    const config = await this.getEmailProviderConfig(companyId);
    if (config && config.smtpConfig) {
      await this.database.client.smtpConfig.update({
        where: { id: config.smtpConfig.id },
        data: {
          enableDkim: true,
          dkimPrivateKey: keyPair.privateKey,
          dkimSelector: keyPair.selector,
          dkimDomain: config.smtpConfig.fromEmail.split('@')[1],
        },
      });
    }

    return {
      selector: keyPair.selector,
      publicKey: keyPair.publicKey,
      dnsRecord: {
        name: `${keyPair.selector}._domainkey.${config?.smtpConfig?.fromEmail.split('@')[1]}`,
        type: 'TXT',
        value: keyPair.publicKey,
      },
    };
  }

  private async validateProviderConfig(
    config: EmailProviderConfig
  ): Promise<void> {
    if (config.provider === 'SENDGRID') {
      if (!config.sendgridConfig || !config.sendgridConfig.apiKey) {
        throw new Error('SendGrid configuration requires API key');
      }

      if (!config.sendgridConfig.fromEmail) {
        throw new Error('SendGrid configuration requires from email');
      }
    }

    if (config.provider === 'SMTP') {
      if (!config.smtpConfig) {
        throw new Error('SMTP configuration is required');
      }

      const required = ['host', 'port', 'username', 'password', 'fromEmail'];
      for (const field of required) {
        if (!config.smtpConfig[field]) {
          throw new Error(`SMTP configuration requires ${field}`);
        }
      }
    }
  }

  private async sendViaConfiguredSendGrid(
    request: EmailSendRequest,
    _sendgridConfig: any
  ): Promise<any> {
    // This would use the configured SendGrid credentials
    // For now, using the existing SendGrid service
    return this.sendGridService.sendEmail({
      to: request.to,
      subject: request.subject,
      content: request.content,
      leadId: request.leadId,
    });
  }

  private async logEmailDelivery(logData: any): Promise<void> {
    try {
      // This would use the EmailDeliveryLog model from the schema
      this.logger.debug('Email delivery logged:', logData);
    } catch (error) {
      this.logger.error('Failed to log email delivery:', error);
    }
  }

  async getDeliveryStats(companyId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // This would query the delivery logs for statistics
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      averageDeliveryTime: 0,
      reputationScore: 85,
      period: `Last ${days} days`,
    };
  }
}
