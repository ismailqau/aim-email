import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: AnalyticsService;

  const mockAnalyticsService = {
    getDashboardMetrics: jest.fn(),
    getPerformanceData: jest.fn(),
    getPipelineMetrics: jest.fn(),
    exportData: jest.fn(),
  };

  const mockRequest = {
    user: {
      sub: 'user-1',
      email: 'user@example.com',
      companyId: 'company-1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    const mockDashboardMetrics = {
      totalLeads: 500,
      activeLeads: 450,
      emailsSent: 200,
      openRate: 75,
      clickRate: 37.5,
      replyRate: 5.2,
      conversionRate: 12.5,
    };

    it('should return dashboard metrics', async () => {
      mockAnalyticsService.getDashboardMetrics.mockResolvedValue(mockDashboardMetrics);

      const result = await controller.getDashboard(mockRequest);

      expect(analyticsService.getDashboardMetrics).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockDashboardMetrics);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockAnalyticsService.getDashboardMetrics.mockRejectedValue(error);

      await expect(controller.getDashboard(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('getPerformance', () => {
    const mockPerformanceData = [
      {
        period: '2023-01-15',
        emailsSent: 2,
        opens: 2,
        clicks: 1,
        replies: 0,
        conversions: 0,
        openRate: 100,
        clickRate: 50,
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
    ];

    it('should return performance data with date filters', async () => {
      const params = {
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      mockAnalyticsService.getPerformanceData.mockResolvedValue(mockPerformanceData);

      const result = await controller.getPerformance(mockRequest, params);

      expect(analyticsService.getPerformanceData).toHaveBeenCalledWith(
        'company-1',
        '2023-01-01',
        '2023-01-31',
      );
      expect(result).toEqual(mockPerformanceData);
    });

    it('should return performance data without date filters', async () => {
      const params = {};

      mockAnalyticsService.getPerformanceData.mockResolvedValue(mockPerformanceData);

      const result = await controller.getPerformance(mockRequest, params);

      expect(analyticsService.getPerformanceData).toHaveBeenCalledWith(
        'company-1',
        undefined,
        undefined,
      );
      expect(result).toEqual(mockPerformanceData);
    });

    it('should handle custom date ranges', async () => {
      const params = {
        startDate: '2023-06-01',
        endDate: '2023-06-30',
      };

      mockAnalyticsService.getPerformanceData.mockResolvedValue([]);

      const result = await controller.getPerformance(mockRequest, params);

      expect(analyticsService.getPerformanceData).toHaveBeenCalledWith(
        'company-1',
        '2023-06-01',
        '2023-06-30',
      );
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Failed to fetch performance data');
      mockAnalyticsService.getPerformanceData.mockRejectedValue(error);

      await expect(controller.getPerformance(mockRequest, {})).rejects.toThrow(error);
    });
  });

  describe('getPipelineMetrics', () => {
    const mockPipelineMetrics = [
      {
        id: 'pipeline-1',
        name: 'Welcome Series',
        totalExecutions: 3,
        activeExecutions: 1,
        completedExecutions: 2,
        conversionRate: 66.7,
        averageCompletionTime: 2.5,
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
    ];

    it('should return pipeline metrics', async () => {
      mockAnalyticsService.getPipelineMetrics.mockResolvedValue(mockPipelineMetrics);

      const result = await controller.getPipelineMetrics(mockRequest);

      expect(analyticsService.getPipelineMetrics).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockPipelineMetrics);
    });

    it('should handle empty pipeline metrics', async () => {
      mockAnalyticsService.getPipelineMetrics.mockResolvedValue([]);

      const result = await controller.getPipelineMetrics(mockRequest);

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Failed to fetch pipeline metrics');
      mockAnalyticsService.getPipelineMetrics.mockRejectedValue(error);

      await expect(controller.getPipelineMetrics(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('exportData', () => {
    const mockExportResponse = {
      message: 'Exporting analytics data',
      downloadUrl: '/api/downloads/analytics-export.csv',
    };

    it('should export analytics data', async () => {
      const params = {
        type: 'analytics',
        format: 'csv',
      };

      mockAnalyticsService.exportData.mockResolvedValue(mockExportResponse);

      const result = await controller.exportData(mockRequest, params);

      expect(analyticsService.exportData).toHaveBeenCalledWith('company-1', 'analytics', params);
      expect(result).toEqual(mockExportResponse);
    });

    it('should export performance data with date range', async () => {
      const params = {
        type: 'performance',
        format: 'xlsx',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      const customExportResponse = {
        message: 'Exporting performance data',
        downloadUrl: '/api/downloads/performance-export.xlsx',
      };

      mockAnalyticsService.exportData.mockResolvedValue(customExportResponse);

      const result = await controller.exportData(mockRequest, params);

      expect(analyticsService.exportData).toHaveBeenCalledWith('company-1', 'performance', params);
      expect(result).toEqual(customExportResponse);
    });

    it('should export pipeline data', async () => {
      const params = {
        type: 'pipelines',
        format: 'json',
      };

      const pipelineExportResponse = {
        message: 'Exporting pipelines data',
        downloadUrl: '/api/downloads/pipelines-export.json',
      };

      mockAnalyticsService.exportData.mockResolvedValue(pipelineExportResponse);

      const result = await controller.exportData(mockRequest, params);

      expect(analyticsService.exportData).toHaveBeenCalledWith('company-1', 'pipelines', params);
      expect(result).toEqual(pipelineExportResponse);
    });

    it('should handle missing export type', async () => {
      const params = {
        format: 'csv',
        // type is missing
      };

      mockAnalyticsService.exportData.mockResolvedValue(mockExportResponse);

      const result = await controller.exportData(mockRequest, params);

      expect(analyticsService.exportData).toHaveBeenCalledWith('company-1', undefined, params);
      expect(result).toEqual(mockExportResponse);
    });

    it('should handle export service errors', async () => {
      const params = {
        type: 'analytics',
        format: 'csv',
      };

      const error = new Error('Export generation failed');
      mockAnalyticsService.exportData.mockRejectedValue(error);

      await expect(controller.exportData(mockRequest, params)).rejects.toThrow(error);
    });
  });
});