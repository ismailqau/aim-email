import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/database/database.service';
import { DnsValidationService } from './dns-validation.service';
import { promisify } from 'util';
import { lookup } from 'dns';

export interface ReputationMetrics {
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
  unsubscribeRate: number;
  spamRate: number;
  reputationScore: number;
  domainReputation: DomainReputationInfo;
  recommendations: string[];
  warnings: string[];
}

export interface DomainReputationInfo {
  domain: string;
  hasSPF: boolean;
  hasDKIM: boolean;
  hasDMARC: boolean;
  mxRecords: number;
  blacklistStatus: BlacklistStatus[];
  trustScore: number;
}

export interface BlacklistStatus {
  provider: string;
  status: 'clean' | 'listed' | 'unknown';
  lastChecked: Date;
}

export interface DeliveryOptimization {
  recommendedSendingVolume: number;
  optimalSendingTimes: string[];
  domainWarmupPlan: WarmupStep[];
  contentOptimizations: string[];
}

export interface WarmupStep {
  day: number;
  maxEmails: number;
  targetDomains: string[];
  description: string;
}

@Injectable()
export class EmailReputationService {
  private readonly logger = new Logger(EmailReputationService.name);
  private readonly blacklistProviders = [
    'zen.spamhaus.org',
    'bl.spamcop.net',
    'dnsbl.sorbs.net',
    'cbl.abuseat.org',
    'pbl.spamhaus.org'
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService,
    private readonly dnsValidationService: DnsValidationService,
  ) {}

  async getCompanyReputationMetrics(companyId: string): Promise<ReputationMetrics> {
    try {
      // Get email settings for the company
      const emailSettings = await this.database.client.emailSettings.findUnique({
        where: { companyId },
        include: {
          sendgridConfig: true,
          smtpConfig: true,
        },
      });

      if (!emailSettings) {
        throw new Error('No email settings found for company');
      }

      // Calculate delivery metrics from email logs
      const deliveryMetrics = await this.calculateDeliveryMetrics(companyId);
      
      // Get domain reputation information
      const fromEmail = emailSettings.provider === 'SENDGRID' 
        ? emailSettings.sendgridConfig?.fromEmail 
        : emailSettings.smtpConfig?.fromEmail;

      const domainReputation = fromEmail 
        ? await this.analyzeDomainReputation(fromEmail)
        : this.getDefaultDomainReputation();

      // Calculate overall reputation score
      const reputationScore = this.calculateReputationScore(deliveryMetrics, domainReputation);

      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(deliveryMetrics, domainReputation);
      const warnings = this.generateWarnings(deliveryMetrics, domainReputation);

      return {
        ...deliveryMetrics,
        reputationScore,
        domainReputation,
        recommendations,
        warnings,
      };
    } catch (error) {
      this.logger.error(`Failed to get reputation metrics for company ${companyId}:`, error);
      throw error;
    }
  }

  async analyzeDeliveryOptimization(companyId: string): Promise<DeliveryOptimization> {
    const metrics = await this.getCompanyReputationMetrics(companyId);
    
    // Calculate recommended sending volume based on current reputation
    const recommendedSendingVolume = this.calculateOptimalSendingVolume(metrics);
    
    // Determine optimal sending times based on historical data
    const optimalSendingTimes = await this.getOptimalSendingTimes(companyId);
    
    // Generate domain warmup plan for new domains or low reputation
    const domainWarmupPlan = this.generateDomainWarmupPlan(metrics.reputationScore);
    
    // Content optimization suggestions
    const contentOptimizations = this.generateContentOptimizations(metrics);

    return {
      recommendedSendingVolume,
      optimalSendingTimes,
      domainWarmupPlan,
      contentOptimizations,
    };
  }

  async monitorBlacklistStatus(domain: string): Promise<BlacklistStatus[]> {
    const results: BlacklistStatus[] = [];
    const lookupAsync = promisify(lookup);

    for (const provider of this.blacklistProviders) {
      try {
        const reversedIP = await this.getReversedIP(domain);
        const query = `${reversedIP}.${provider}`;
        
        await lookupAsync(query);
        
        // If lookup succeeds, IP is listed
        results.push({
          provider,
          status: 'listed',
          lastChecked: new Date(),
        });
      } catch (error) {
        // If lookup fails, IP is clean (not listed)
        results.push({
          provider,
          status: 'clean',
          lastChecked: new Date(),
        });
      }
    }

    return results;
  }

  async trackEmailDelivery(emailData: {
    companyId: string;
    emailId: string;
    status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'unsubscribed';
    provider: 'SENDGRID' | 'SMTP';
    deliveryTime?: number;
    errorMessage?: string;
    recipientDomain?: string;
  }): Promise<void> {
    try {
      // Log the delivery event for reputation tracking
      await this.database.client.emailEvent.create({
        data: {
          emailId: emailData.emailId,
          eventType: emailData.status.toUpperCase() as any,
          timestamp: new Date(),
          eventData: {
            provider: emailData.provider,
            deliveryTime: emailData.deliveryTime,
            errorMessage: emailData.errorMessage,
            recipientDomain: emailData.recipientDomain,
            companyId: emailData.companyId,
          },
        },
      });

      // Update reputation metrics cache if needed
      await this.updateReputationCache(emailData.companyId, emailData.status);
      
      this.logger.debug(`Email delivery tracked: ${emailData.emailId} - ${emailData.status}`);
    } catch (error) {
      this.logger.error(`Failed to track email delivery:`, error);
    }
  }

  private async calculateDeliveryMetrics(companyId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all emails for the company in the last 30 days
    const emails = await this.database.client.email.findMany({
      where: {
        lead: { companyId },
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        emailEvents: true,
      },
    });

    if (emails.length === 0) {
      return {
        deliveryRate: 0,
        bounceRate: 0,
        complaintRate: 0,
        unsubscribeRate: 0,
        spamRate: 0,
      };
    }

    const totalSent = emails.filter(e => e.status === 'SENT').length;
    const delivered = emails.filter(e => 
      e.emailEvents.some(event => event.eventType === 'DELIVERED')
    ).length;
    const bounced = emails.filter(e => 
      e.emailEvents.some(event => event.eventType === 'BOUNCED')
    ).length;
    const complained = emails.filter(e => 
      e.emailEvents.some(event => event.eventType === 'SPAM_REPORT')
    ).length;
    const unsubscribed = emails.filter(e => 
      e.emailEvents.some(event => event.eventType === 'UNSUBSCRIBE')
    ).length;

    return {
      deliveryRate: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
      bounceRate: totalSent > 0 ? (bounced / totalSent) * 100 : 0,
      complaintRate: totalSent > 0 ? (complained / totalSent) * 100 : 0,
      unsubscribeRate: totalSent > 0 ? (unsubscribed / totalSent) * 100 : 0,
      spamRate: totalSent > 0 ? (complained / totalSent) * 100 : 0,
    };
  }

  private async analyzeDomainReputation(fromEmail: string): Promise<DomainReputationInfo> {
    const domain = fromEmail.split('@')[1];
    
    // Check DNS records
    const spfRecord = await this.dnsValidationService.validateSPF(domain);
    const dmarcRecord = await this.dnsValidationService.validateDMARC(domain);
    const mxRecords = await this.dnsValidationService.validateMX(domain);
    
    // Check blacklist status
    const blacklistStatus = await this.monitorBlacklistStatus(domain);
    
    // Calculate trust score based on various factors
    const trustScore = this.calculateDomainTrustScore({
      hasSPF: spfRecord.isValid,
      hasDKIM: false, // DKIM validation would need to be implemented separately
      hasDMARC: dmarcRecord.isValid,
      mxRecords: mxRecords.isValid ? 1 : 0,
      blacklistStatus,
    });

    return {
      domain,
      hasSPF: spfRecord.isValid,
      hasDKIM: false, // Placeholder - would need DKIM validation
      hasDMARC: dmarcRecord.isValid,
      mxRecords: mxRecords.isValid ? 1 : 0,
      blacklistStatus,
      trustScore,
    };
  }

  private getDefaultDomainReputation(): DomainReputationInfo {
    return {
      domain: 'unknown',
      hasSPF: false,
      hasDKIM: false,
      hasDMARC: false,
      mxRecords: 0,
      blacklistStatus: [],
      trustScore: 0,
    };
  }

  private calculateReputationScore(
    deliveryMetrics: any,
    domainReputation: DomainReputationInfo
  ): number {
    // Weighted scoring algorithm
    const deliveryWeight = 0.4;
    const domainWeight = 0.3;
    const complianceWeight = 0.3;

    // Delivery score (0-100)
    const deliveryScore = Math.max(0, 
      100 - (deliveryMetrics.bounceRate * 2) - (deliveryMetrics.complaintRate * 5)
    );

    // Domain score (0-100)
    const domainScore = domainReputation.trustScore;

    // Compliance score (0-100)
    const complianceScore = (
      (domainReputation.hasSPF ? 25 : 0) +
      (domainReputation.hasDKIM ? 25 : 0) +
      (domainReputation.hasDMARC ? 25 : 0) +
      (domainReputation.mxRecords > 0 ? 25 : 0)
    );

    const finalScore = 
      (deliveryScore * deliveryWeight) +
      (domainScore * domainWeight) +
      (complianceScore * complianceWeight);

    return Math.round(Math.max(0, Math.min(100, finalScore)));
  }

  private generateRecommendations(
    deliveryMetrics: any,
    domainReputation: DomainReputationInfo
  ): string[] {
    const recommendations: string[] = [];

    // DNS recommendations
    if (!domainReputation.hasSPF) {
      recommendations.push('Add SPF record to your domain to improve deliverability');
    }
    if (!domainReputation.hasDKIM) {
      recommendations.push('Configure DKIM signing for email authentication');
    }
    if (!domainReputation.hasDMARC) {
      recommendations.push('Implement DMARC policy to protect against spoofing');
    }

    // Delivery recommendations
    if (deliveryMetrics.bounceRate > 5) {
      recommendations.push('High bounce rate detected. Clean your email list and validate addresses');
    }
    if (deliveryMetrics.complaintRate > 0.1) {
      recommendations.push('High complaint rate. Review email content and targeting');
    }
    if (deliveryMetrics.deliveryRate < 95) {
      recommendations.push('Consider implementing email warmup process for better deliverability');
    }

    // Blacklist recommendations
    const listedProviders = domainReputation.blacklistStatus.filter(bl => bl.status === 'listed');
    if (listedProviders.length > 0) {
      recommendations.push(`Remove your IP from blacklists: ${listedProviders.map(p => p.provider).join(', ')}`);
    }

    return recommendations;
  }

  private generateWarnings(
    deliveryMetrics: any,
    domainReputation: DomainReputationInfo
  ): string[] {
    const warnings: string[] = [];

    if (deliveryMetrics.bounceRate > 10) {
      warnings.push('Critical bounce rate detected - immediate action required');
    }
    if (deliveryMetrics.complaintRate > 0.5) {
      warnings.push('High spam complaint rate - risk of provider blocking');
    }
    if (domainReputation.blacklistStatus.some(bl => bl.status === 'listed')) {
      warnings.push('Domain or IP is blacklisted - emails may not be delivered');
    }

    return warnings;
  }

  private calculateOptimalSendingVolume(metrics: ReputationMetrics): number {
    // Base volume on reputation score
    const baseVolume = 1000;
    const reputationMultiplier = metrics.reputationScore / 100;
    
    return Math.round(baseVolume * reputationMultiplier);
  }

  private async getOptimalSendingTimes(companyId: string): Promise<string[]> {
    // This would analyze historical open/click data to determine optimal times
    // For now, return standard business hours
    return [
      '09:00-11:00 Tuesday-Thursday',
      '14:00-16:00 Tuesday-Thursday',
      '10:00-12:00 Monday,Friday'
    ];
  }

  private generateDomainWarmupPlan(reputationScore: number): WarmupStep[] {
    if (reputationScore > 80) {
      return []; // No warmup needed for high reputation
    }

    return [
      {
        day: 1,
        maxEmails: 50,
        targetDomains: ['gmail.com', 'outlook.com'],
        description: 'Start with major providers, low volume'
      },
      {
        day: 3,
        maxEmails: 100,
        targetDomains: ['gmail.com', 'outlook.com', 'yahoo.com'],
        description: 'Increase volume gradually'
      },
      {
        day: 7,
        maxEmails: 250,
        targetDomains: ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'],
        description: 'Add more providers, maintain engagement'
      },
      {
        day: 14,
        maxEmails: 500,
        targetDomains: ['*'],
        description: 'Full volume to all domains'
      }
    ];
  }

  private generateContentOptimizations(metrics: ReputationMetrics): string[] {
    const optimizations: string[] = [];

    if (metrics.complaintRate > 0.1) {
      optimizations.push('Review subject lines for spam triggers');
      optimizations.push('Add clear unsubscribe links');
      optimizations.push('Improve content relevance and targeting');
    }

    if (metrics.bounceRate > 5) {
      optimizations.push('Implement email validation before sending');
      optimizations.push('Remove invalid addresses from lists');
    }

    return optimizations;
  }

  private async getReversedIP(domain: string): Promise<string> {
    // This would get the actual IP address of the domain and reverse it
    // For now, return a placeholder
    return '127.0.0.1'.split('.').reverse().join('.');
  }

  private calculateDomainTrustScore(factors: {
    hasSPF: boolean;
    hasDKIM: boolean;
    hasDMARC: boolean;
    mxRecords: number;
    blacklistStatus: BlacklistStatus[];
  }): number {
    let score = 0;

    // DNS records contribute to trust
    if (factors.hasSPF) score += 20;
    if (factors.hasDKIM) score += 20;
    if (factors.hasDMARC) score += 20;
    if (factors.mxRecords > 0) score += 20;

    // Blacklist status
    const cleanLists = factors.blacklistStatus.filter(bl => bl.status === 'clean').length;
    const totalLists = factors.blacklistStatus.length;
    if (totalLists > 0) {
      score += (cleanLists / totalLists) * 20;
    }

    return Math.round(score);
  }

  private async updateReputationCache(companyId: string, eventType: string): Promise<void> {
    // This would update cached reputation metrics for real-time monitoring
    // Implementation would depend on your caching strategy
    this.logger.debug(`Updating reputation cache for company ${companyId}: ${eventType}`);
  }
}