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
import * as dns from 'dns-lookup';
import * as crypto from 'crypto';
import { DatabaseService } from '../common/database/database.service';

export interface DnsRecordValidation {
  domain: string;
  recordType: 'SPF' | 'DKIM' | 'DMARC' | 'MX';
  isValid: boolean;
  currentValue?: string;
  recommendedValue?: string;
  issues?: string[];
  lastChecked: Date;
}

export interface DomainSetupGuide {
  domain: string;
  spf: DnsRecordValidation;
  dkim: DnsRecordValidation;
  dmarc: DnsRecordValidation;
  mx: DnsRecordValidation;
  overallScore: number;
  setupInstructions: string[];
}

@Injectable()
export class DnsValidationService {
  private readonly logger = new Logger(DnsValidationService.name);

  constructor(private readonly database: DatabaseService) {}

  async validateDomainSetup(domain: string, smtpHost?: string): Promise<DomainSetupGuide> {
    this.logger.log(`Validating DNS setup for domain: ${domain}`);
    
    const [spf, dkim, dmarc, mx] = await Promise.all([
      this.validateSPF(domain, smtpHost),
      this.validateDKIM(domain),
      this.validateDMARC(domain),
      this.validateMX(domain),
    ]);

    const overallScore = this.calculateOverallScore([spf, dkim, dmarc, mx]);
    const setupInstructions = this.generateSetupInstructions(domain, spf, dkim, dmarc, mx);

    return {
      domain,
      spf,
      dkim,
      dmarc,
      mx,
      overallScore,
      setupInstructions,
    };
  }

  async validateSPF(domain: string, smtpHost?: string): Promise<DnsRecordValidation> {
    try {
      const txtRecords = await this.lookupTXTRecords(domain);
      const spfRecord = txtRecords.find(record => record.includes('v=spf1'));
      
      const validation: DnsRecordValidation = {
        domain,
        recordType: 'SPF',
        isValid: false,
        lastChecked: new Date(),
        issues: [],
      };

      if (!spfRecord) {
        validation.issues.push('No SPF record found');
        validation.recommendedValue = this.generateSPFRecord(domain, smtpHost);
      } else {
        validation.currentValue = spfRecord;
        validation.isValid = this.validateSPFRecord(spfRecord, smtpHost);
        
        if (!validation.isValid) {
          validation.issues.push('SPF record exists but may not include your SMTP server');
          validation.recommendedValue = this.generateSPFRecord(domain, smtpHost);
        }
      }

      return validation;
    } catch (error) {
      this.logger.error(`SPF validation failed for ${domain}:`, error);
      return {
        domain,
        recordType: 'SPF',
        isValid: false,
        lastChecked: new Date(),
        issues: [`DNS lookup failed: ${error.message}`],
      };
    }
  }

  async validateDKIM(domain: string, selector: string = 'default'): Promise<DnsRecordValidation> {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`;
      const txtRecords = await this.lookupTXTRecords(dkimDomain);
      const dkimRecord = txtRecords.find(record => record.includes('v=DKIM1'));
      
      const validation: DnsRecordValidation = {
        domain,
        recordType: 'DKIM',
        isValid: !!dkimRecord,
        lastChecked: new Date(),
        issues: [],
      };

      if (!dkimRecord) {
        validation.issues.push(`No DKIM record found for selector '${selector}'`);
        validation.recommendedValue = this.generateDKIMRecord();
      } else {
        validation.currentValue = dkimRecord;
        
        if (!dkimRecord.includes('p=')) {
          validation.isValid = false;
          validation.issues.push('DKIM record missing public key (p= parameter)');
        }
      }

      return validation;
    } catch (error) {
      this.logger.error(`DKIM validation failed for ${domain}:`, error);
      return {
        domain,
        recordType: 'DKIM',
        isValid: false,
        lastChecked: new Date(),
        issues: [`DNS lookup failed: ${error.message}`],
      };
    }
  }

  async validateDMARC(domain: string): Promise<DnsRecordValidation> {
    try {
      const dmarcDomain = `_dmarc.${domain}`;
      const txtRecords = await this.lookupTXTRecords(dmarcDomain);
      const dmarcRecord = txtRecords.find(record => record.includes('v=DMARC1'));
      
      const validation: DnsRecordValidation = {
        domain,
        recordType: 'DMARC',
        isValid: !!dmarcRecord,
        lastChecked: new Date(),
        issues: [],
      };

      if (!dmarcRecord) {
        validation.issues.push('No DMARC record found');
        validation.recommendedValue = this.generateDMARCRecord(domain);
      } else {
        validation.currentValue = dmarcRecord;
        
        // Validate DMARC policy
        if (!dmarcRecord.includes('p=')) {
          validation.isValid = false;
          validation.issues.push('DMARC record missing policy (p= parameter)');
        } else if (dmarcRecord.includes('p=none')) {
          validation.issues.push('DMARC policy is set to \"none\" - consider using \"quarantine\" or \"reject\"');
        }
      }

      return validation;
    } catch (error) {
      this.logger.error(`DMARC validation failed for ${domain}:`, error);
      return {
        domain,
        recordType: 'DMARC',
        isValid: false,
        lastChecked: new Date(),
        issues: [`DNS lookup failed: ${error.message}`],
      };
    }
  }

  async validateMX(domain: string): Promise<DnsRecordValidation> {
    try {
      const mxRecords = await this.lookupMXRecords(domain);
      
      const validation: DnsRecordValidation = {
        domain,
        recordType: 'MX',
        isValid: mxRecords.length > 0,
        lastChecked: new Date(),
        issues: [],
      };

      if (mxRecords.length === 0) {
        validation.issues.push('No MX records found - this domain cannot receive email');
      } else {
        validation.currentValue = mxRecords.map(mx => `${mx.priority} ${mx.exchange}`).join(', ');
        
        // Check for proper MX configuration
        const sortedMX = mxRecords.sort((a, b) => a.priority - b.priority);
        if (sortedMX.length === 1 && sortedMX[0].priority !== 10) {
          validation.issues.push('Consider using priority 10 for your primary MX record');
        }
      }

      return validation;
    } catch (error) {
      this.logger.error(`MX validation failed for ${domain}:`, error);
      return {
        domain,
        recordType: 'MX',
        isValid: false,
        lastChecked: new Date(),
        issues: [`DNS lookup failed: ${error.message}`],
      };
    }
  }

  private async lookupTXTRecords(domain: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.default.txt(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          const flatRecords = (records || []).map(record => 
            Array.isArray(record) ? record.join('') : record
          );
          resolve(flatRecords);
        }
      });
    });
  }

  private async lookupMXRecords(domain: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      dns.default.mx(domain, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records || []);
        }
      });
    });
  }

  private generateSPFRecord(domain: string, smtpHost?: string): string {
    let spf = 'v=spf1';
    
    // Include common email services
    const commonIncludes = [
      'include:_spf.google.com',  // Google Workspace
      'include:spf.protection.outlook.com',  // Microsoft 365
    ];
    
    // Add SMTP host if provided
    if (smtpHost) {
      if (smtpHost.includes('gmail') || smtpHost.includes('google')) {
        spf += ' include:_spf.google.com';
      } else if (smtpHost.includes('outlook') || smtpHost.includes('hotmail')) {
        spf += ' include:spf.protection.outlook.com';
      } else {
        spf += ` a:${smtpHost}`;
      }
    }
    
    spf += ' ~all';
    return spf;
  }

  private generateDKIMRecord(): string {
    return 'v=DKIM1; k=rsa; p=<YOUR_DKIM_PUBLIC_KEY>';
  }

  private generateDMARCRecord(domain: string): string {
    return `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; fo=1`;
  }

  private validateSPFRecord(spfRecord: string, smtpHost?: string): boolean {
    // Basic SPF validation
    if (!spfRecord.includes('v=spf1')) return false;
    if (!spfRecord.includes('all')) return false;
    
    // If SMTP host is provided, check if it's included
    if (smtpHost) {
      return spfRecord.includes(smtpHost) || 
             spfRecord.includes('include:') || 
             spfRecord.includes('a:');
    }
    
    return true;
  }

  private calculateOverallScore(validations: DnsRecordValidation[]): number {
    const weights = { SPF: 30, DKIM: 25, DMARC: 25, MX: 20 };
    let totalScore = 0;
    let totalWeight = 0;

    validations.forEach(validation => {
      const weight = weights[validation.recordType] || 0;
      totalWeight += weight;
      
      if (validation.isValid) {
        totalScore += weight;
      } else if (validation.issues && validation.issues.length > 0) {
        // Partial credit for existing but invalid records
        totalScore += weight * 0.3;
      }
    });

    return Math.round((totalScore / totalWeight) * 100);
  }

  private generateSetupInstructions(
    domain: string,
    spf: DnsRecordValidation,
    dkim: DnsRecordValidation,
    dmarc: DnsRecordValidation,
    mx: DnsRecordValidation
  ): string[] {
    const instructions: string[] = [];

    instructions.push('# DNS Configuration Instructions for Email Deliverability');
    instructions.push('');
    instructions.push('Add the following DNS records to your domain registrar or DNS provider:');
    instructions.push('');

    if (!spf.isValid && spf.recommendedValue) {
      instructions.push('## SPF Record (Sender Policy Framework)');
      instructions.push('Record Type: TXT');
      instructions.push(`Name: ${domain}`);
      instructions.push(`Value: ${spf.recommendedValue}`);
      instructions.push('TTL: 3600');
      instructions.push('');
    }

    if (!dkim.isValid) {
      instructions.push('## DKIM Record (DomainKeys Identified Mail)');
      instructions.push('Record Type: TXT');
      instructions.push(`Name: default._domainkey.${domain}`);
      instructions.push(`Value: ${dkim.recommendedValue || this.generateDKIMRecord()}`);
      instructions.push('TTL: 3600');
      instructions.push('Note: You need to generate a DKIM key pair. Use the private key in your SMTP configuration.');
      instructions.push('');
    }

    if (!dmarc.isValid && dmarc.recommendedValue) {
      instructions.push('## DMARC Record (Domain-based Message Authentication)');
      instructions.push('Record Type: TXT');
      instructions.push(`Name: _dmarc.${domain}`);
      instructions.push(`Value: ${dmarc.recommendedValue}`);
      instructions.push('TTL: 3600');
      instructions.push('');
    }

    if (!mx.isValid) {
      instructions.push('## MX Record (Mail Exchange)');
      instructions.push('Record Type: MX');
      instructions.push(`Name: ${domain}`);
      instructions.push('Value: 10 mail.your-provider.com');
      instructions.push('TTL: 3600');
      instructions.push('Note: Replace \"mail.your-provider.com\" with your actual mail server.');
      instructions.push('');
    }

    instructions.push('## Additional Recommendations:');
    instructions.push('1. Use a static IP address for your SMTP server');
    instructions.push('2. Ensure reverse DNS (PTR) record is set for your IP');
    instructions.push('3. Implement proper bounce handling');
    instructions.push('4. Monitor your sender reputation regularly');
    instructions.push('5. Use TLS encryption for all email connections');

    return instructions;
  }

  async generateDKIMKeyPair(): Promise<{ privateKey: string; publicKey: string; selector: string }> {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          // Extract the public key for DNS record
          const publicKeyForDNS = publicKey
            .replace(/-----BEGIN PUBLIC KEY-----/, '')
            .replace(/-----END PUBLIC KEY-----/, '')
            .replace(/\\s/g, '');
          
          const selector = `sel${Date.now()}`;
          
          resolve({
            privateKey,
            publicKey: `v=DKIM1; k=rsa; p=${publicKeyForDNS}`,
            selector
          });
        }
      });
    });
  }
}