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

import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';

describe('PipelinesController', () => {
  let controller: PipelinesController;
  let pipelinesService: PipelinesService;

  const mockPipelinesService = {
    createPipeline: jest.fn(),
    getPipelines: jest.fn(),
    getPipelineById: jest.fn(),
    startPipeline: jest.fn(),
    updatePipeline: jest.fn(),
    deletePipeline: jest.fn(),
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
      controllers: [PipelinesController],
      providers: [
        {
          provide: PipelinesService,
          useValue: mockPipelinesService,
        },
      ],
    }).compile();

    controller = module.get<PipelinesController>(PipelinesController);
    pipelinesService = module.get<PipelinesService>(PipelinesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPipeline', () => {
    const pipelineData = {
      name: 'Welcome Series',
      description: 'New customer welcome pipeline',
      isActive: true,
    };

    const mockPipeline = {
      id: 'pipeline-1',
      ...pipelineData,
      companyId: 'company-1',
      createdAt: new Date(),
    };

    it('should create a pipeline', async () => {
      mockPipelinesService.createPipeline.mockResolvedValue(mockPipeline);

      const result = await controller.createPipeline(mockRequest, pipelineData);

      expect(pipelinesService.createPipeline).toHaveBeenCalledWith('company-1', pipelineData);
      expect(result).toEqual(mockPipeline);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockPipelinesService.createPipeline.mockRejectedValue(error);

      await expect(controller.createPipeline(mockRequest, pipelineData)).rejects.toThrow(error);
    });
  });

  describe('getPipelines', () => {
    const mockPipelines = [
      {
        id: 'pipeline-1',
        name: 'Welcome Series',
        companyId: 'company-1',
        pipelineSteps: [
          { id: 'step-1', order: 1, delayHours: 0 },
          { id: 'step-2', order: 2, delayHours: 24 },
        ],
        createdAt: new Date(),
      },
      {
        id: 'pipeline-2',
        name: 'Follow-up Series',
        companyId: 'company-1',
        pipelineSteps: [
          { id: 'step-3', order: 1, delayHours: 48 },
        ],
        createdAt: new Date(),
      },
    ];

    it('should return all pipelines for user company', async () => {
      mockPipelinesService.getPipelines.mockResolvedValue(mockPipelines);

      const result = await controller.getPipelines(mockRequest);

      expect(pipelinesService.getPipelines).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockPipelines);
    });

    it('should return empty array when no pipelines', async () => {
      mockPipelinesService.getPipelines.mockResolvedValue([]);

      const result = await controller.getPipelines(mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('getPipelineById', () => {
    const pipelineId = 'pipeline-1';
    const mockPipeline = {
      id: pipelineId,
      name: 'Welcome Series',
      companyId: 'company-1',
      pipelineSteps: [
        {
          id: 'step-1',
          order: 1,
          delayHours: 0,
          emailTemplate: { id: 'template-1', name: 'Welcome Email' },
        },
      ],
      pipelineExecutions: [
        {
          id: 'execution-1',
          status: 'RUNNING',
          lead: { id: 'lead-1', email: 'test@example.com' },
          startedAt: new Date(),
        },
      ],
    };

    it('should return a pipeline by id', async () => {
      mockPipelinesService.getPipelineById.mockResolvedValue(mockPipeline);

      const result = await controller.getPipelineById(mockRequest, pipelineId);

      expect(pipelinesService.getPipelineById).toHaveBeenCalledWith('company-1', pipelineId);
      expect(result).toEqual(mockPipeline);
    });

    it('should return null when pipeline not found', async () => {
      mockPipelinesService.getPipelineById.mockResolvedValue(null);

      const result = await controller.getPipelineById(mockRequest, 'non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('startPipeline', () => {
    const pipelineId = 'pipeline-1';
    const data = { leadIds: ['lead-1', 'lead-2'] };

    const mockStartResponse = {
      message: 'Pipeline started for 2 leads',
      executions: [
        { id: 'execution-1', pipelineId, leadId: 'lead-1', status: 'RUNNING' },
        { id: 'execution-2', pipelineId, leadId: 'lead-2', status: 'RUNNING' },
      ],
    };

    it('should start pipeline for leads', async () => {
      mockPipelinesService.startPipeline.mockResolvedValue(mockStartResponse);

      const result = await controller.startPipeline(pipelineId, data);

      expect(pipelinesService.startPipeline).toHaveBeenCalledWith(pipelineId, data.leadIds);
      expect(result).toEqual(mockStartResponse);
    });

    it('should handle start errors', async () => {
      const error = new Error('Pipeline not found or inactive');
      mockPipelinesService.startPipeline.mockRejectedValue(error);

      await expect(controller.startPipeline(pipelineId, data)).rejects.toThrow(error);
    });

    it('should handle empty lead array', async () => {
      const emptyData = { leadIds: [] };
      const emptyResponse = {
        message: 'Pipeline started for 0 leads',
        executions: [],
      };

      mockPipelinesService.startPipeline.mockResolvedValue(emptyResponse);

      const result = await controller.startPipeline(pipelineId, emptyData);

      expect(pipelinesService.startPipeline).toHaveBeenCalledWith(pipelineId, []);
      expect(result).toEqual(emptyResponse);
    });
  });

  describe('updatePipeline', () => {
    const pipelineId = 'pipeline-1';
    const updateData = {
      name: 'Updated Pipeline',
      description: 'Updated description',
    };

    const mockUpdatedPipeline = {
      id: pipelineId,
      ...updateData,
      companyId: 'company-1',
      createdAt: new Date(),
    };

    it('should update a pipeline', async () => {
      mockPipelinesService.updatePipeline.mockResolvedValue(mockUpdatedPipeline);

      const result = await controller.updatePipeline(mockRequest, pipelineId, updateData);

      expect(pipelinesService.updatePipeline).toHaveBeenCalledWith('company-1', pipelineId, updateData);
      expect(result).toEqual(mockUpdatedPipeline);
    });

    it('should handle update errors', async () => {
      const error = new Error('Pipeline not found');
      mockPipelinesService.updatePipeline.mockRejectedValue(error);

      await expect(controller.updatePipeline(mockRequest, pipelineId, updateData)).rejects.toThrow(error);
    });
  });

  describe('deletePipeline', () => {
    const pipelineId = 'pipeline-1';

    it('should delete a pipeline', async () => {
      const mockResponse = { message: 'Pipeline deleted successfully' };
      mockPipelinesService.deletePipeline.mockResolvedValue(mockResponse);

      const result = await controller.deletePipeline(mockRequest, pipelineId);

      expect(pipelinesService.deletePipeline).toHaveBeenCalledWith('company-1', pipelineId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Pipeline not found');
      mockPipelinesService.deletePipeline.mockRejectedValue(error);

      await expect(controller.deletePipeline(mockRequest, pipelineId)).rejects.toThrow(error);
    });
  });
});