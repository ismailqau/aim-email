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

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmailsService } from './emails.service';
import { EmailDeliveryService } from './email-delivery.service';
import { EmailProviderService } from './email-provider.service';
import { DnsValidationService } from './dns-validation.service';
import { EmailReputationService } from './email-reputation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Emails')
@Controller('emails')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly emailDeliveryService: EmailDeliveryService,
    private readonly emailProviderService: EmailProviderService,
    private readonly dnsValidationService: DnsValidationService,
    private readonly emailReputationService: EmailReputationService
  ) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI email content' })
  async generateEmail(@Body() generateData: any) {
    return this.emailsService.generateEmailContent(
      generateData.leadId,
      generateData.context
    );
  }

  @Post('send')
  @ApiOperation({ summary: 'Send email to lead' })
  async sendEmail(@Body() emailData: any, @Request() req) {
    // Use the company-specific email provider configuration
    return this.emailProviderService.sendEmailWithCompanyConfig({
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content,
      leadId: emailData.leadId,
      companyId: req.user.companyId,
    });
  }

  @Get('test-services')
  @ApiOperation({ summary: 'Test email service availability' })
  async testEmailServices() {
    return this.emailDeliveryService.testEmailServices();
  }

  @Get('preferred-provider')
  @ApiOperation({ summary: 'Get preferred email provider' })
  async getPreferredProvider() {
    const provider = await this.emailDeliveryService.getPreferredProvider();
    return { provider };
  }

  // Email Provider Configuration
  @Post('provider/configure')
  @ApiOperation({ summary: 'Configure email provider (SendGrid or SMTP)' })
  async configureProvider(@Body() configData: any, @Request() req) {
    return this.emailProviderService.configureEmailProvider({
      ...configData,
      companyId: req.user.companyId,
    });
  }

  @Get('provider/config')
  @ApiOperation({ summary: 'Get current email provider configuration' })
  async getProviderConfig(@Request() req) {
    return this.emailProviderService.getEmailProviderConfig(req.user.companyId);
  }

  @Get('provider/validate')
  @ApiOperation({ summary: 'Validate email provider setup' })
  async validateSetup(@Request() req) {
    return this.emailProviderService.validateEmailSetup(req.user.companyId);
  }

  @Post('provider/test')
  @ApiOperation({ summary: 'Test email configuration' })
  async testConfiguration(@Body() testData: { email: string }, @Request() req) {
    return this.emailProviderService.testEmailConfiguration(
      req.user.companyId,
      testData.email
    );
  }

  // DNS and Domain Validation
  @Get('dns/validate/:domain')
  @ApiOperation({ summary: 'Validate DNS setup for domain' })
  async validateDNS(
    @Param('domain') domain: string,
    @Query('smtpHost') smtpHost?: string
  ) {
    return this.dnsValidationService.validateDomainSetup(domain, smtpHost);
  }

  @Post('dkim/generate')
  @ApiOperation({ summary: 'Generate DKIM key pair' })
  async generateDKIM(@Request() req) {
    return this.emailProviderService.generateDKIMKeyPair(req.user.companyId);
  }

  // Email Analytics
  @Get('stats')
  @ApiOperation({ summary: 'Get email delivery statistics' })
  async getDeliveryStats(@Request() req, @Query('days') days?: string) {
    const period = days ? parseInt(days, 10) : 30;
    return this.emailProviderService.getDeliveryStats(
      req.user.companyId,
      period
    );
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get email templates' })
  async getTemplates(@Request() req) {
    return this.emailsService.getEmailTemplates(req.user.companyId);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create email template' })
  async createTemplate(@Request() req, @Body() templateData: any) {
    return this.emailsService.createEmailTemplate(
      req.user.companyId,
      templateData
    );
  }

  // Email Reputation Monitoring
  @Get('reputation/metrics')
  @ApiOperation({ summary: 'Get email reputation metrics' })
  async getReputationMetrics(@Request() req) {
    return this.emailReputationService.getCompanyReputationMetrics(
      req.user.companyId
    );
  }

  @Get('reputation/optimization')
  @ApiOperation({ summary: 'Get delivery optimization recommendations' })
  async getDeliveryOptimization(@Request() req) {
    return this.emailReputationService.analyzeDeliveryOptimization(
      req.user.companyId
    );
  }

  @Get('reputation/blacklist/:domain')
  @ApiOperation({ summary: 'Check domain blacklist status' })
  async checkBlacklistStatus(@Param('domain') domain: string) {
    return this.emailReputationService.monitorBlacklistStatus(domain);
  }

  @Post('reputation/track')
  @ApiOperation({ summary: 'Track email delivery event' })
  async trackDeliveryEvent(@Body() eventData: any, @Request() req) {
    return this.emailReputationService.trackEmailDelivery({
      ...eventData,
      companyId: req.user.companyId,
    });
  }
}
