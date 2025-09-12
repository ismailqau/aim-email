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

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly database: DatabaseService) {}

  async getDashboardMetrics(companyId: string) {
    const [
      totalLeads,
      activeLeads,
      emailsSent,
      emailEvents,
    ] = await Promise.all([
      this.database.client.lead.count({
        where: { companyId },
      }),
      this.database.client.lead.count({
        where: { companyId, status: 'ACTIVE' },
      }),
      this.database.client.email.count({
        where: { 
          lead: { companyId },
          status: { in: ['SENT', 'DELIVERED'] },
        },
      }),
      this.database.client.emailEvent.groupBy({
        by: ['eventType'],
        where: {
          email: {
            lead: { companyId },
          },
        },
        _count: true,
      }),
    ]);

    // Calculate rates
    const openEvents = emailEvents.find(e => e.eventType === 'OPENED')?._count || 0;
    const clickEvents = emailEvents.find(e => e.eventType === 'CLICKED')?._count || 0;
    
    const openRate = emailsSent > 0 ? (openEvents / emailsSent) * 100 : 0;
    const clickRate = emailsSent > 0 ? (clickEvents / emailsSent) * 100 : 0;

    return {
      totalLeads,
      activeLeads,
      emailsSent,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      replyRate: 0, // TODO: Calculate reply rate
      conversionRate: 0, // TODO: Calculate conversion rate
    };
  }

  async getPerformanceData(companyId: string, startDate?: string, endDate?: string) {
    const dateFilter = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };

    const emails = await this.database.client.email.findMany({
      where: {
        lead: { companyId },
        sentAt: dateFilter,
      },
      include: {
        emailEvents: true,
      },
    });

    // Group by date
    const performanceByDate = {};
    
    emails.forEach(email => {
      const date = email.sentAt?.toISOString().split('T')[0];
      if (!date) return;
      
      if (!performanceByDate[date]) {
        performanceByDate[date] = {
          period: date,
          emailsSent: 0,
          opens: 0,
          clicks: 0,
          replies: 0,
          conversions: 0,
        };
      }
      
      performanceByDate[date].emailsSent++;
      
      email.emailEvents.forEach(event => {
        if (event.eventType === 'OPENED') {
          performanceByDate[date].opens++;
        } else if (event.eventType === 'CLICKED') {
          performanceByDate[date].clicks++;
        }
      });
    });

    // Calculate rates
    return Object.values(performanceByDate).map((data: any) => ({
      ...data,
      openRate: data.emailsSent > 0 ? (data.opens / data.emailsSent) * 100 : 0,
      clickRate: data.emailsSent > 0 ? (data.clicks / data.emailsSent) * 100 : 0,
      replyRate: 0,
      conversionRate: 0,
    }));
  }

  async getPipelineMetrics(companyId: string) {
    const pipelines = await this.database.client.pipeline.findMany({
      where: { companyId },
      include: {
        pipelineExecutions: true,
      },
    });

    return pipelines.map(pipeline => {
      const executions = pipeline.pipelineExecutions;
      const totalExecutions = executions.length;
      const activeExecutions = executions.filter(e => e.status === 'RUNNING').length;
      const completedExecutions = executions.filter(e => e.status === 'COMPLETED').length;
      
      return {
        id: pipeline.id,
        name: pipeline.name,
        totalExecutions,
        activeExecutions,
        completedExecutions,
        conversionRate: 0, // TODO: Calculate based on actual conversions
        averageCompletionTime: 0, // TODO: Calculate average time
      };
    });
  }

  async exportData(companyId: string, type: string, params: any) {
    // TODO: Implement data export functionality
    return {
      message: `Exporting ${type} data`,
      downloadUrl: '/api/downloads/analytics-export.csv',
    };
  }
}