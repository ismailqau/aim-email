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

import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DatabaseService } from '../common/database/database.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockDatabaseService = {
    client: {
      lead: {
        count: jest.fn(),
      },
      email: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      emailEvent: {
        groupBy: jest.fn(),
      },
      pipeline: {
        findMany: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    const companyId = 'company-1';

    const mockEmailEvents = [
      { eventType: 'OPENED', _count: 150 },
      { eventType: 'CLICKED', _count: 75 },
      { eventType: 'DELIVERED', _count: 200 },
    ];

    beforeEach(() => {
      mockDatabaseService.client.lead.count
        .mockResolvedValueOnce(500) // total leads
        .mockResolvedValueOnce(450); // active leads

      mockDatabaseService.client.email.count.mockResolvedValue(200); // emails sent

      mockDatabaseService.client.emailEvent.groupBy.mockResolvedValue(
        mockEmailEvents
      );
    });

    it('should return dashboard metrics with calculated rates', async () => {
      const result = await service.getDashboardMetrics(companyId);

      expect(mockDatabaseService.client.lead.count).toHaveBeenCalledTimes(2);
      expect(mockDatabaseService.client.lead.count).toHaveBeenNthCalledWith(1, {
        where: { companyId },
      });
      expect(mockDatabaseService.client.lead.count).toHaveBeenNthCalledWith(2, {
        where: { companyId, status: 'ACTIVE' },
      });

      expect(mockDatabaseService.client.email.count).toHaveBeenCalledWith({
        where: {
          lead: { companyId },
          status: { in: ['SENT', 'DELIVERED'] },
        },
      });

      expect(
        mockDatabaseService.client.emailEvent.groupBy
      ).toHaveBeenCalledWith({
        by: ['eventType'],
        where: {
          email: {
            lead: { companyId },
          },
        },
        _count: true,
      });

      expect(result).toEqual({
        totalLeads: 500,
        activeLeads: 450,
        emailsSent: 200,
        openRate: 75, // (150/200) * 100 = 75%
        clickRate: 37.5, // (75/200) * 100 = 37.5%
        replyRate: 0, // TODO
        conversionRate: 0, // TODO
      });
    });

    it('should handle zero emails sent', async () => {
      mockDatabaseService.client.email.count.mockResolvedValue(0);

      const result = await service.getDashboardMetrics(companyId);

      expect(result.openRate).toBe(0);
      expect(result.clickRate).toBe(0);
      expect(result.emailsSent).toBe(0);
    });

    it('should handle missing email events', async () => {
      mockDatabaseService.client.emailEvent.groupBy.mockResolvedValue([]);

      const result = await service.getDashboardMetrics(companyId);

      expect(result.openRate).toBe(0);
      expect(result.clickRate).toBe(0);
    });

    it('should round rates to 2 decimal places', async () => {
      // Setup for rate calculation that results in many decimal places
      mockDatabaseService.client.email.count.mockResolvedValue(7); // 7 emails sent
      const fractionalEvents = [
        { eventType: 'OPENED', _count: 2 }, // 2/7 = 28.571428...%
        { eventType: 'CLICKED', _count: 1 }, // 1/7 = 14.285714...%
      ];
      mockDatabaseService.client.emailEvent.groupBy.mockResolvedValue(
        fractionalEvents
      );

      const result = await service.getDashboardMetrics(companyId);

      expect(result.openRate).toBe(28.57); // Rounded to 2 decimal places
      expect(result.clickRate).toBe(14.29); // Rounded to 2 decimal places
    });
  });

  describe('getPerformanceData', () => {
    const companyId = 'company-1';
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';

    const mockEmails = [
      {
        id: 'email-1',
        sentAt: new Date('2023-01-15T10:00:00Z'),
        emailEvents: [{ eventType: 'OPENED' }, { eventType: 'CLICKED' }],
      },
      {
        id: 'email-2',
        sentAt: new Date('2023-01-15T11:00:00Z'),
        emailEvents: [{ eventType: 'OPENED' }],
      },
      {
        id: 'email-3',
        sentAt: new Date('2023-01-16T09:00:00Z'),
        emailEvents: [],
      },
    ];

    it('should return performance data grouped by date', async () => {
      mockDatabaseService.client.email.findMany.mockResolvedValue(mockEmails);

      const result = await service.getPerformanceData(
        companyId,
        startDate,
        endDate
      );

      expect(mockDatabaseService.client.email.findMany).toHaveBeenCalledWith({
        where: {
          lead: { companyId },
          sentAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        include: {
          emailEvents: true,
        },
      });

      expect(result).toEqual([
        {
          period: '2023-01-15',
          emailsSent: 2,
          opens: 2,
          clicks: 1,
          replies: 0,
          conversions: 0,
          openRate: 100, // 2/2 * 100
          clickRate: 50, // 1/2 * 100
          replyRate: 0,
          conversionRate: 0,
        },
        {
          period: '2023-01-16',
          emailsSent: 1,
          opens: 0,
          clicks: 0,
          replies: 0,
          conversions: 0,
          openRate: 0,
          clickRate: 0,
          replyRate: 0,
          conversionRate: 0,
        },
      ]);
    });

    it('should handle performance data without date filters', async () => {
      mockDatabaseService.client.email.findMany.mockResolvedValue(mockEmails);

      await service.getPerformanceData(companyId);

      expect(mockDatabaseService.client.email.findMany).toHaveBeenCalledWith({
        where: {
          lead: { companyId },
          sentAt: {},
        },
        include: {
          emailEvents: true,
        },
      });
    });

    it('should handle emails with null sentAt dates', async () => {
      const emailsWithNullDate = [
        {
          id: 'email-1',
          sentAt: null,
          emailEvents: [{ eventType: 'OPENED' }],
        },
        ...mockEmails,
      ];

      mockDatabaseService.client.email.findMany.mockResolvedValue(
        emailsWithNullDate
      );

      const result = await service.getPerformanceData(companyId);

      // Should ignore emails with null sentAt dates
      expect(result).toHaveLength(2); // Only the 2 valid dates
    });

    it('should handle empty email data', async () => {
      mockDatabaseService.client.email.findMany.mockResolvedValue([]);

      const result = await service.getPerformanceData(companyId);

      expect(result).toEqual([]);
    });
  });

  describe('getPipelineMetrics', () => {
    const companyId = 'company-1';

    const mockPipelines = [
      {
        id: 'pipeline-1',
        name: 'Welcome Series',
        pipelineExecutions: [
          { id: 'exec-1', status: 'RUNNING' },
          { id: 'exec-2', status: 'COMPLETED' },
          { id: 'exec-3', status: 'COMPLETED' },
        ],
      },
      {
        id: 'pipeline-2',
        name: 'Follow-up Series',
        pipelineExecutions: [
          { id: 'exec-4', status: 'RUNNING' },
          { id: 'exec-5', status: 'RUNNING' },
        ],
      },
      {
        id: 'pipeline-3',
        name: 'Empty Pipeline',
        pipelineExecutions: [],
      },
    ];

    it('should return pipeline metrics with execution counts', async () => {
      mockDatabaseService.client.pipeline.findMany.mockResolvedValue(
        mockPipelines
      );

      const result = await service.getPipelineMetrics(companyId);

      expect(mockDatabaseService.client.pipeline.findMany).toHaveBeenCalledWith(
        {
          where: { companyId },
          include: {
            pipelineExecutions: true,
          },
        }
      );

      expect(result).toEqual([
        {
          id: 'pipeline-1',
          name: 'Welcome Series',
          totalExecutions: 3,
          activeExecutions: 1,
          completedExecutions: 2,
          conversionRate: 0, // TODO
          averageCompletionTime: 0, // TODO
        },
        {
          id: 'pipeline-2',
          name: 'Follow-up Series',
          totalExecutions: 2,
          activeExecutions: 2,
          completedExecutions: 0,
          conversionRate: 0,
          averageCompletionTime: 0,
        },
        {
          id: 'pipeline-3',
          name: 'Empty Pipeline',
          totalExecutions: 0,
          activeExecutions: 0,
          completedExecutions: 0,
          conversionRate: 0,
          averageCompletionTime: 0,
        },
      ]);
    });

    it('should handle various execution statuses', async () => {
      const pipelineWithMixedStatuses = [
        {
          id: 'pipeline-1',
          name: 'Mixed Status Pipeline',
          pipelineExecutions: [
            { id: 'exec-1', status: 'RUNNING' },
            { id: 'exec-2', status: 'COMPLETED' },
            { id: 'exec-3', status: 'FAILED' },
            { id: 'exec-4', status: 'PAUSED' },
          ],
        },
      ];

      mockDatabaseService.client.pipeline.findMany.mockResolvedValue(
        pipelineWithMixedStatuses
      );

      const result = await service.getPipelineMetrics(companyId);

      expect(result[0]).toEqual({
        id: 'pipeline-1',
        name: 'Mixed Status Pipeline',
        totalExecutions: 4,
        activeExecutions: 1, // Only RUNNING status counts as active
        completedExecutions: 1, // Only COMPLETED status counts as completed
        conversionRate: 0,
        averageCompletionTime: 0,
      });
    });

    it('should handle empty pipelines array', async () => {
      mockDatabaseService.client.pipeline.findMany.mockResolvedValue([]);

      const result = await service.getPipelineMetrics(companyId);

      expect(result).toEqual([]);
    });
  });

  describe('exportData', () => {
    const companyId = 'company-1';

    it('should return export information for analytics data', async () => {
      const result = await service.exportData(companyId, 'analytics', {
        format: 'csv',
      });

      expect(result).toEqual({
        message: 'Exporting analytics data',
        downloadUrl: '/api/downloads/analytics-export.csv',
      });
    });

    it('should handle different export types', async () => {
      const result = await service.exportData(companyId, 'performance', {
        format: 'xlsx',
      });

      expect(result).toEqual({
        message: 'Exporting performance data',
        downloadUrl: '/api/downloads/analytics-export.csv',
      });
    });

    it('should handle export with custom parameters', async () => {
      const params = {
        format: 'json',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      const result = await service.exportData(companyId, 'leads', params);

      expect(result).toEqual({
        message: 'Exporting leads data',
        downloadUrl: '/api/downloads/analytics-export.csv',
      });
    });
  });
});
