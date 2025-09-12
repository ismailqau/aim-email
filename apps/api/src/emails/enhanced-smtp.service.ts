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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as validator from 'validator';
import { DatabaseService } from '../common/database/database.service';
import { promisify } from 'util';
import { resolveMx, resolveTxt } from 'dns';

export interface SmtpConfigData {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;

  // DKIM Configuration
  enableDkim?: boolean;
  dkimPrivateKey?: string;
  dkimSelector?: string;
  dkimDomain?: string;

  // Connection settings
  maxConnections?: number;
  maxMessages?: number;
  rateLimit?: number;
  connectionTimeout?: number;
  socketTimeout?: number;
  greetingTimeout?: number;

  // Reputation settings
  useStaticIp?: boolean;
  staticIpAddress?: string;
  enableTls?: boolean;
  requireTls?: boolean;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deliveryTime?: number;
  reputationScore?: number;
  warnings?: string[];
}

@Injectable()
export class EnhancedSmtpService {
  private readonly logger = new Logger(EnhancedSmtpService.name);
  private transporterPool: Map<string, nodemailer.Transporter> = new Map();
  private connectionStats: Map<string, any> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService
  ) {}

  async createTransporter(
    config: SmtpConfigData
  ): Promise<nodemailer.Transporter> {
    const configKey = this.generateConfigKey(config);

    if (this.transporterPool.has(configKey)) {
      return this.transporterPool.get(configKey);
    }

    const transportOptions: any = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
      pool: true,
      maxConnections: config.maxConnections || 5,
      maxMessages: config.maxMessages || 100,
      rateLimit: config.rateLimit || 10,
      connectionTimeout: config.connectionTimeout || 60000,
      socketTimeout: config.socketTimeout || 60000,
      greetingTimeout: config.greetingTimeout || 30000,

      // TLS Configuration for better deliverability
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
      requireTLS: config.requireTls || false,

      // Custom headers for reputation
      headers: {
        'X-Mailer': 'AI Email Marketing System v1.0',
        'X-Priority': '3',
      },
    };

    // Add DKIM signing if configured
    if (
      config.enableDkim &&
      config.dkimPrivateKey &&
      config.dkimSelector &&
      config.dkimDomain
    ) {
      transportOptions.dkim = {
        privateKey: config.dkimPrivateKey,
        keySelector: config.dkimSelector,
        domainName: config.dkimDomain,
        headerFieldNames: 'from,to,subject,date,message-id',
      };
      this.logger.log(`DKIM signing enabled for domain: ${config.dkimDomain}`);
    }

    // Configure static IP if provided
    if (config.useStaticIp && config.staticIpAddress) {
      transportOptions.localAddress = config.staticIpAddress;
      this.logger.log(`Using static IP: ${config.staticIpAddress}`);
    }

    try {
      const transporter = nodemailer.createTransport(transportOptions);

      // Verify connection
      await transporter.verify();

      this.transporterPool.set(configKey, transporter);
      this.initializeConnectionStats(configKey);

      this.logger.log(
        `SMTP transporter created successfully for ${config.host}:${config.port}`
      );
      return transporter;
    } catch (error) {
      this.logger.error(`Failed to create SMTP transporter:`, error);
      throw new Error(`SMTP configuration failed: ${error.message}`);
    }
  }

  async sendEmailWithConfig(
    emailData: {
      to: string;
      subject: string;
      content: string;
      leadId?: string;
    },
    config: SmtpConfigData
  ): Promise<EmailDeliveryResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Validate email address
      if (!validator.isEmail(emailData.to)) {
        throw new Error(`Invalid recipient email address: ${emailData.to}`);
      }

      // Validate sender configuration
      await this.validateSenderConfiguration(config);

      const transporter = await this.createTransporter(config);
      const configKey = this.generateConfigKey(config);

      // Check rate limits
      await this.checkRateLimit(configKey);

      // Prepare email with enhanced headers
      const mailOptions = {
        from: {
          name: config.fromName,
          address: config.fromEmail,
        },
        to: emailData.to,
        replyTo: config.replyToEmail || config.fromEmail,
        subject: emailData.subject,
        html: emailData.content,

        // Enhanced headers for better deliverability
        headers: {
          'List-Unsubscribe': `<mailto:unsubscribe@${this.extractDomain(config.fromEmail)}>`,
          'X-Campaign-ID': emailData.leadId || 'direct',
          'X-Sender-IP': config.staticIpAddress || 'dynamic',
          Precedence: 'bulk',
        },

        // Message tracking
        messageId: this.generateMessageId(config.fromEmail),
      };

      // Add domain-specific configuration warnings
      const domainWarnings = await this.checkDomainReputation(config.fromEmail);
      warnings.push(...domainWarnings);

      const info = await transporter.sendMail(mailOptions);
      const deliveryTime = Date.now() - startTime;

      // Update connection stats
      this.updateConnectionStats(configKey, true, deliveryTime);

      // Calculate reputation score
      const reputationScore = this.calculateReputationScore(configKey);

      // Log delivery for tracking
      await this.logEmailDelivery({
        emailId: emailData.leadId,
        provider: 'SMTP',
        messageId: info.messageId,
        status: 'SENT',
        deliveryTime,
        reputationScore,
      });

      // Update email record if leadId provided
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: {
            status: 'SENT',
            sentAt: new Date(),
            sendgridMessageId: info.messageId,
          },
        });
      }

      this.logger.log(
        `Email sent successfully via SMTP to ${emailData.to}. MessageId: ${info.messageId}, DeliveryTime: ${deliveryTime}ms`
      );

      return {
        success: true,
        messageId: info.messageId,
        deliveryTime,
        reputationScore,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      const deliveryTime = Date.now() - startTime;
      const configKey = this.generateConfigKey(config);

      this.updateConnectionStats(configKey, false, deliveryTime);

      // Log failed delivery
      await this.logEmailDelivery({
        emailId: emailData.leadId,
        provider: 'SMTP',
        status: 'FAILED',
        errorMessage: error.message,
        deliveryTime,
      });

      // Update email record as failed
      if (emailData.leadId) {
        await this.database.client.email.updateMany({
          where: { leadId: emailData.leadId, status: 'SCHEDULED' },
          data: { status: 'FAILED' },
        });
      }

      this.logger.error(`SMTP email sending failed:`, error);

      return {
        success: false,
        error: error.message,
        deliveryTime,
        warnings,
      };
    }
  }

  private async validateSenderConfiguration(
    config: SmtpConfigData
  ): Promise<void> {
    // Validate domain ownership
    const domain = this.extractDomain(config.fromEmail);

    try {
      // Check MX records
      const mxRecords = await this.lookupMXRecords(domain);
      if (mxRecords.length === 0) {
        throw new Error(`No MX records found for domain: ${domain}`);
      }

      // Validate SMTP host is reachable
      await this.validateSmtpHost(config.host, config.port);
    } catch (error) {
      this.logger.warn(
        `Sender configuration validation warning: ${error.message}`
      );
    }
  }

  private async checkDomainReputation(fromEmail: string): Promise<string[]> {
    const warnings: string[] = [];
    const domain = this.extractDomain(fromEmail);

    try {
      // Check for SPF record
      const spfRecord = await this.lookupSPFRecord(domain);
      if (!spfRecord) {
        warnings.push(
          `No SPF record found for domain ${domain}. This may affect deliverability.`
        );
      }

      // Check for DMARC record
      const dmarcRecord = await this.lookupDMARCRecord(domain);
      if (!dmarcRecord) {
        warnings.push(
          `No DMARC record found for domain ${domain}. Consider adding one for better reputation.`
        );
      }
    } catch (error) {
      this.logger.warn(`Domain reputation check failed: ${error.message}`);
    }

    return warnings;
  }

  private async lookupMXRecords(domain: string): Promise<any[]> {
    const resolveMxAsync = promisify(resolveMx);
    try {
      const records = await resolveMxAsync(domain);
      return records || [];
    } catch (error) {
      return [];
    }
  }

  private async lookupSPFRecord(domain: string): Promise<string | null> {
    const resolveTxtAsync = promisify(resolveTxt);
    try {
      const records = await resolveTxtAsync(domain);
      if (!records) return null;

      const spfRecord = records.find((record: string | string[]) =>
        Array.isArray(record)
          ? record.join('').includes('v=spf1')
          : record.includes('v=spf1')
      );

      return spfRecord
        ? Array.isArray(spfRecord)
          ? spfRecord.join('')
          : spfRecord
        : null;
    } catch (error) {
      return null;
    }
  }

  private async lookupDMARCRecord(domain: string): Promise<string | null> {
    const resolveTxtAsync = promisify(resolveTxt);
    try {
      const records = await resolveTxtAsync(`_dmarc.${domain}`);
      if (!records) return null;

      const dmarcRecord = records.find((record: string | string[]) =>
        Array.isArray(record)
          ? record.join('').includes('v=DMARC1')
          : record.includes('v=DMARC1')
      );

      return dmarcRecord
        ? Array.isArray(dmarcRecord)
          ? dmarcRecord.join('')
          : dmarcRecord
        : null;
    } catch (error) {
      return null;
    }
  }

  private async validateSmtpHost(_host: string, _port: number): Promise<void> {
    // Implementation would check if SMTP host is reachable
    // This is a placeholder for the actual network connectivity check
  }

  private async checkRateLimit(configKey: string): Promise<void> {
    const stats = this.connectionStats.get(configKey);
    if (!stats) return;

    const now = Date.now();
    const windowStart = now - 60 * 1000; // 1 minute window

    // Clean old entries
    stats.recentSends = stats.recentSends.filter(
      (time: number) => time > windowStart
    );

    if (stats.recentSends.length >= stats.rateLimit) {
      const waitTime = stats.recentSends[0] + 60000 - now;
      throw new Error(
        `Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`
      );
    }
  }

  private generateConfigKey(config: SmtpConfigData): string {
    return `${config.host}:${config.port}:${config.username}`;
  }

  private generateMessageId(fromEmail: string): string {
    const domain = this.extractDomain(fromEmail);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `<${timestamp}.${random}@${domain}>`;
  }

  private extractDomain(email: string): string {
    return email.split('@')[1];
  }

  private initializeConnectionStats(configKey: string): void {
    this.connectionStats.set(configKey, {
      totalSent: 0,
      totalFailed: 0,
      averageDeliveryTime: 0,
      recentSends: [],
      rateLimit: 10,
      reputation: 100,
    });
  }

  private updateConnectionStats(
    configKey: string,
    success: boolean,
    deliveryTime: number
  ): void {
    const stats = this.connectionStats.get(configKey);
    if (!stats) return;

    const now = Date.now();
    stats.recentSends.push(now);

    if (success) {
      stats.totalSent++;
      stats.averageDeliveryTime =
        (stats.averageDeliveryTime * (stats.totalSent - 1) + deliveryTime) /
        stats.totalSent;
    } else {
      stats.totalFailed++;
      stats.reputation = Math.max(0, stats.reputation - 5);
    }
  }

  private calculateReputationScore(configKey: string): number {
    const stats = this.connectionStats.get(configKey);
    if (!stats) return 50;

    const successRate = stats.totalSent / (stats.totalSent + stats.totalFailed);
    const deliveryScore = Math.min(
      100,
      100000 / (stats.averageDeliveryTime || 1000)
    );

    return Math.round(successRate * 70 + deliveryScore * 30);
  }

  private async logEmailDelivery(logData: any): Promise<void> {
    try {
      // This would log to the email_delivery_logs table
      // Implementation depends on your database schema
      this.logger.debug(`Email delivery logged:`, logData);
    } catch (error) {
      this.logger.error(`Failed to log email delivery:`, error);
    }
  }

  async getConnectionStats(configKey?: string): Promise<any> {
    if (configKey) {
      return this.connectionStats.get(configKey) || null;
    }
    return Object.fromEntries(this.connectionStats);
  }

  async closeAllConnections(): Promise<void> {
    for (const [key, transporter] of this.transporterPool) {
      try {
        transporter.close();
        this.logger.log(`Closed SMTP connection: ${key}`);
      } catch (error) {
        this.logger.error(`Failed to close SMTP connection ${key}:`, error);
      }
    }

    this.transporterPool.clear();
    this.connectionStats.clear();
  }
}
