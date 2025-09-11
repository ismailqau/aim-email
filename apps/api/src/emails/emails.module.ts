import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { SendGridService } from './sendgrid.service';
import { SmtpService } from './smtp.service';
import { EmailDeliveryService } from './email-delivery.service';
import { EnhancedSmtpService } from './enhanced-smtp.service';
import { EmailProviderService } from './email-provider.service';
import { DnsValidationService } from './dns-validation.service';
import { EmailReputationService } from './email-reputation.service';

@Module({
  controllers: [EmailsController],
  providers: [
    EmailsService,
    SendGridService,
    SmtpService,
    EmailDeliveryService,
    EnhancedSmtpService,
    EmailProviderService,
    DnsValidationService,
    EmailReputationService,
  ],
  exports: [
    EmailsService,
    SendGridService,
    SmtpService,
    EmailDeliveryService,
    EnhancedSmtpService,
    EmailProviderService,
    DnsValidationService,
    EmailReputationService,
  ],
})
export class EmailsModule {}