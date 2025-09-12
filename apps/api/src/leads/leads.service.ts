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

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class LeadsService {
  constructor(private readonly database: DatabaseService) {}

  async createLead(companyId: string, leadData: any) {
    const existingLead = await this.database.client.lead.findFirst({
      where: { companyId, email: leadData.email },
    });

    if (existingLead) {
      throw new BadRequestException('Lead with this email already exists');
    }

    return this.database.client.lead.create({
      data: { ...leadData, companyId, priorityScore: leadData.priorityScore || 50 },
    });
  }

  async getLeads(companyId: string, query: any = {}) {
    const { page = 1, limit = 50, search, status } = query;
    const skip = (page - 1) * limit;
    
    const where: any = { companyId };
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      this.database.client.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.database.client.lead.count({ where }),
    ]);

    return {
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLeadById(companyId: string, leadId: string) {
    const lead = await this.database.client.lead.findFirst({
      where: { id: leadId, companyId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async updateLead(companyId: string, leadId: string, updateData: any) {
    const lead = await this.getLeadById(companyId, leadId);
    
    return this.database.client.lead.update({
      where: { id: leadId },
      data: updateData,
    });
  }

  async deleteLead(companyId: string, leadId: string) {
    await this.getLeadById(companyId, leadId);
    
    await this.database.client.lead.delete({
      where: { id: leadId },
    });

    return { message: 'Lead deleted successfully' };
  }

  async uploadLeadsFromCsv(companyId: string, csvData: any[]) {
    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < csvData.length; i++) {
      try {
        const row = csvData[i];
        
        if (!row.email || !this.isValidEmail(row.email)) {
          errors.push(`Row ${i + 1}: Invalid email`);
          continue;
        }

        await this.createLead(companyId, {
          email: row.email,
          firstName: row.firstName || row.first_name || '',
          lastName: row.lastName || row.last_name || '',
          title: row.title || '',
          companyName: row.companyName || row.company_name || '',
          customFields: { source: 'CSV Import' },
        });

        successCount++;
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      summary: {
        totalRows: csvData.length,
        successfulImports: successCount,
        failedImports: csvData.length - successCount,
      },
      errors: errors.slice(0, 20),
    };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}