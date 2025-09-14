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
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      data: {
        ...leadData,
        companyId,
        priorityScore: leadData.priorityScore || 50,
      },
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
    await this.getLeadById(companyId, leadId);

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
        errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Lead Scoring Methods
  async updateLeadScore(companyId: string, leadId: string, score: number) {
    await this.getLeadById(companyId, leadId);

    return this.database.client.lead.update({
      where: { id: leadId },
      data: { priorityScore: score },
    });
  }

  async calculateLeadScore(companyId: string, leadId: string) {
    const lead = await this.getLeadById(companyId, leadId);

    let score = 0;

    // Base scoring criteria
    if (lead.title) {
      const seniorTitles = [
        'ceo',
        'cto',
        'cfo',
        'vp',
        'director',
        'manager',
        'head',
      ];
      const hasTitle = seniorTitles.some(title =>
        lead.title!.toLowerCase().includes(title)
      );
      if (hasTitle) score += 25;
    }

    if (lead.companyName) score += 15;
    if (lead.firstName && lead.lastName) score += 10;

    // Email engagement scoring
    const emailStats = await this.database.client.email.findMany({
      where: { leadId },
      include: {
        emailEvents: true,
      },
    });

    const totalEmails = emailStats.length;
    const openedEmails = emailStats.filter(email =>
      email.emailEvents.some(event => event.eventType === 'OPENED')
    ).length;
    const clickedEmails = emailStats.filter(email =>
      email.emailEvents.some(event => event.eventType === 'CLICKED')
    ).length;

    if (totalEmails > 0) {
      const openRate = (openedEmails / totalEmails) * 100;
      const clickRate = (clickedEmails / totalEmails) * 100;

      score += Math.min(openRate * 0.5, 25); // Max 25 points for opens
      score += Math.min(clickRate * 2, 25); // Max 25 points for clicks
    }

    // Update the lead with calculated score
    await this.updateLeadScore(companyId, leadId, Math.min(score, 100));

    return { leadId, calculatedScore: Math.min(score, 100) };
  }

  async bulkCalculateScores(companyId: string) {
    const leads = await this.database.client.lead.findMany({
      where: { companyId },
      select: { id: true },
    });

    const results = [];

    for (const lead of leads) {
      try {
        const result = await this.calculateLeadScore(companyId, lead.id);
        results.push(result);
      } catch (error) {
        results.push({
          leadId: lead.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      totalProcessed: leads.length,
      results,
    };
  }

  async getLeadsByScore(
    companyId: string,
    minScore: number = 0,
    maxScore: number = 100
  ) {
    return this.database.client.lead.findMany({
      where: {
        companyId,
        priorityScore: {
          gte: minScore,
          lte: maxScore,
        },
      },
      orderBy: {
        priorityScore: 'desc',
      },
    });
  }
}
