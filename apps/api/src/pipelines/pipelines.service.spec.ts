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
import { getQueueToken } from '@nestjs/bullmq';
import { PipelinesService } from './pipelines.service';
import { DatabaseService } from '../common/database/database.service';
import { Queue } from 'bullmq';

describe('PipelinesService', () => {
  let service: PipelinesService;
  let databaseService: DatabaseService;
  let pipelineQueue: Queue;

  const mockDatabaseService = {
    client: {
      pipeline: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      pipelineExecution: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      stepExecution: {
        create: jest.fn(),
      },
    },
  };

  const mockPipelineQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelinesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: getQueueToken('email-pipeline'),
          useValue: mockPipelineQueue,
        },
      ],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    pipelineQueue = module.get<Queue>(getQueueToken('email-pipeline'));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPipeline', () => {
    const companyId = 'company-1';
    const pipelineData = {
      name: 'Welcome Series',
      description: 'New customer welcome pipeline',
      isActive: true,
    };

    const mockPipeline = {
      id: 'pipeline-1',
      ...pipelineData,
      companyId,
      createdAt: new Date(),
    };

    it('should create a pipeline successfully', async () => {
      mockDatabaseService.client.pipeline.create.mockResolvedValue(mockPipeline);

      const result = await service.createPipeline(companyId, pipelineData);

      expect(mockDatabaseService.client.pipeline.create).toHaveBeenCalledWith({
        data: {
          ...pipelineData,
          companyId,
        },
      });
      expect(result).toEqual(mockPipeline);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Database error');
      mockDatabaseService.client.pipeline.create.mockRejectedValue(error);

      await expect(service.createPipeline(companyId, pipelineData)).rejects.toThrow(error);
    });
  });

  describe('getPipelines', () => {
    const companyId = 'company-1';
    const mockPipelines = [
      {
        id: 'pipeline-1',
        name: 'Welcome Series',
        companyId,
        pipelineSteps: [
          { id: 'step-1', order: 1, delayHours: 0 },
          { id: 'step-2', order: 2, delayHours: 24 },
        ],
        createdAt: new Date('2023-01-01'),
      },
      {
        id: 'pipeline-2',
        name: 'Follow-up Series',
        companyId,
        pipelineSteps: [
          { id: 'step-3', order: 1, delayHours: 48 },
        ],
        createdAt: new Date('2023-01-02'),
      },
    ];

    it('should return pipelines for company', async () => {
      mockDatabaseService.client.pipeline.findMany.mockResolvedValue(mockPipelines);

      const result = await service.getPipelines(companyId);

      expect(mockDatabaseService.client.pipeline.findMany).toHaveBeenCalledWith({
        where: { companyId },
        include: {
          pipelineSteps: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockPipelines);
    });

    it('should return empty array when no pipelines', async () => {
      mockDatabaseService.client.pipeline.findMany.mockResolvedValue([]);

      const result = await service.getPipelines(companyId);

      expect(result).toEqual([]);
    });
  });

  describe('getPipelineById', () => {
    const companyId = 'company-1';
    const pipelineId = 'pipeline-1';
    const mockPipeline = {
      id: pipelineId,
      name: 'Welcome Series',
      companyId,
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

    it('should return pipeline with details', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(mockPipeline);

      const result = await service.getPipelineById(companyId, pipelineId);

      expect(mockDatabaseService.client.pipeline.findFirst).toHaveBeenCalledWith({
        where: { id: pipelineId, companyId },
        include: {
          pipelineSteps: {
            orderBy: { order: 'asc' },
            include: {
              emailTemplate: true,
            },
          },
          pipelineExecutions: {
            include: {
              lead: true,
            },
            orderBy: { startedAt: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(mockPipeline);
    });

    it('should return null when pipeline not found', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(null);

      const result = await service.getPipelineById(companyId, 'non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('startPipeline', () => {
    const pipelineId = 'pipeline-1';
    const leadIds = ['lead-1', 'lead-2'];
    const mockPipeline = {
      id: pipelineId,
      name: 'Welcome Series',
      isActive: true,
      pipelineSteps: [
        { id: 'step-1', order: 1, delayHours: 0 },
        { id: 'step-2', order: 2, delayHours: 24 },
      ],
    };

    const mockExecutions = [
      { id: 'execution-1', pipelineId, leadId: 'lead-1', status: 'RUNNING' },
      { id: 'execution-2', pipelineId, leadId: 'lead-2', status: 'RUNNING' },
    ];

    it('should start pipeline for multiple leads', async () => {
      mockDatabaseService.client.pipeline.findUnique.mockResolvedValue(mockPipeline);
      mockDatabaseService.client.pipelineExecution.create
        .mockResolvedValueOnce(mockExecutions[0])
        .mockResolvedValueOnce(mockExecutions[1]);

      const queueNextStepSpy = jest.spyOn(service, 'queueNextStep').mockResolvedValue();

      const result = await service.startPipeline(pipelineId, leadIds);

      expect(mockDatabaseService.client.pipeline.findUnique).toHaveBeenCalledWith({
        where: { id: pipelineId },
        include: {
          pipelineSteps: {
            orderBy: { order: 'asc' },
          },
        },
      });

      expect(mockDatabaseService.client.pipelineExecution.create).toHaveBeenCalledTimes(2);
      expect(queueNextStepSpy).toHaveBeenCalledTimes(2);
      expect(queueNextStepSpy).toHaveBeenCalledWith('execution-1', 0);
      expect(queueNextStepSpy).toHaveBeenCalledWith('execution-2', 0);

      expect(result).toEqual({
        message: 'Pipeline started for 2 leads',
        executions: mockExecutions,
      });

      queueNextStepSpy.mockRestore();
    });

    it('should throw error when pipeline not found', async () => {
      mockDatabaseService.client.pipeline.findUnique.mockResolvedValue(null);

      await expect(service.startPipeline('non-existent-id', leadIds)).rejects.toThrow(
        'Pipeline not found or inactive',
      );
    });

    it('should throw error when pipeline is inactive', async () => {
      const inactivePipeline = { ...mockPipeline, isActive: false };
      mockDatabaseService.client.pipeline.findUnique.mockResolvedValue(inactivePipeline);

      await expect(service.startPipeline(pipelineId, leadIds)).rejects.toThrow(
        'Pipeline not found or inactive',
      );
    });
  });

  describe('queueNextStep', () => {
    const executionId = 'execution-1';
    const mockExecution = {
      id: executionId,
      pipeline: {
        pipelineSteps: [
          { id: 'step-1', order: 1, delayHours: 0 },
          { id: 'step-2', order: 2, delayHours: 24 },
        ],
      },
      lead: { id: 'lead-1', email: 'test@example.com' },
    };

    const mockStepExecution = {
      id: 'step-execution-1',
      pipelineExecutionId: executionId,
      stepId: 'step-1',
      status: 'SCHEDULED',
    };

    it('should queue next step successfully', async () => {
      mockDatabaseService.client.pipelineExecution.findUnique.mockResolvedValue(mockExecution);
      mockDatabaseService.client.stepExecution.create.mockResolvedValue(mockStepExecution);

      await service.queueNextStep(executionId, 0);

      expect(mockDatabaseService.client.pipelineExecution.findUnique).toHaveBeenCalledWith({
        where: { id: executionId },
        include: {
          pipeline: {
            include: {
              pipelineSteps: {
                orderBy: { order: 'asc' },
              },
            },
          },
          lead: true,
        },
      });

      expect(mockDatabaseService.client.stepExecution.create).toHaveBeenCalledWith({
        data: {
          pipelineExecutionId: executionId,
          stepId: 'step-1',
          status: 'SCHEDULED',
          scheduledAt: expect.any(Date),
        },
      });

      expect(mockPipelineQueue.add).toHaveBeenCalledWith(
        'execute-step',
        {
          stepExecutionId: 'step-execution-1',
          executionId,
          stepIndex: 0,
        },
        {
          delay: 0, // 0 hours delay
        },
      );
    });

    it('should complete execution when no more steps', async () => {
      mockDatabaseService.client.pipelineExecution.findUnique.mockResolvedValue(mockExecution);

      await service.queueNextStep(executionId, 2); // stepIndex beyond available steps

      expect(mockDatabaseService.client.pipelineExecution.update).toHaveBeenCalledWith({
        where: { id: executionId },
        data: {
          status: 'COMPLETED',
          completedAt: expect.any(Date),
        },
      });

      expect(mockDatabaseService.client.stepExecution.create).not.toHaveBeenCalled();
      expect(mockPipelineQueue.add).not.toHaveBeenCalled();
    });

    it('should handle delayed steps', async () => {
      mockDatabaseService.client.pipelineExecution.findUnique.mockResolvedValue(mockExecution);
      mockDatabaseService.client.stepExecution.create.mockResolvedValue({
        ...mockStepExecution,
        stepId: 'step-2',
      });

      await service.queueNextStep(executionId, 1); // Second step with 24h delay

      expect(mockPipelineQueue.add).toHaveBeenCalledWith(
        'execute-step',
        expect.any(Object),
        {
          delay: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        },
      );
    });

    it('should handle execution not found', async () => {
      mockDatabaseService.client.pipelineExecution.findUnique.mockResolvedValue(null);

      await service.queueNextStep('non-existent-id', 0);

      expect(mockDatabaseService.client.stepExecution.create).not.toHaveBeenCalled();
      expect(mockPipelineQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('updatePipeline', () => {
    const companyId = 'company-1';
    const pipelineId = 'pipeline-1';
    const updateData = {
      name: 'Updated Pipeline',
      description: 'Updated description',
    };

    const mockPipeline = {
      id: pipelineId,
      name: 'Original Pipeline',
      companyId,
    };

    const mockUpdatedPipeline = {
      ...mockPipeline,
      ...updateData,
    };

    it('should update pipeline successfully', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(mockPipeline);
      mockDatabaseService.client.pipeline.update.mockResolvedValue(mockUpdatedPipeline);

      const result = await service.updatePipeline(companyId, pipelineId, updateData);

      expect(mockDatabaseService.client.pipeline.findFirst).toHaveBeenCalledWith({
        where: { id: pipelineId, companyId },
      });
      expect(mockDatabaseService.client.pipeline.update).toHaveBeenCalledWith({
        where: { id: pipelineId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedPipeline);
    });

    it('should throw error when pipeline not found', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(null);

      await expect(service.updatePipeline(companyId, 'non-existent-id', updateData)).rejects.toThrow(
        'Pipeline not found',
      );
    });
  });

  describe('deletePipeline', () => {
    const companyId = 'company-1';
    const pipelineId = 'pipeline-1';
    const mockPipeline = {
      id: pipelineId,
      name: 'Test Pipeline',
      companyId,
    };

    it('should delete pipeline successfully', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(mockPipeline);
      mockDatabaseService.client.pipeline.delete.mockResolvedValue({});

      const result = await service.deletePipeline(companyId, pipelineId);

      expect(mockDatabaseService.client.pipeline.findFirst).toHaveBeenCalledWith({
        where: { id: pipelineId, companyId },
      });
      expect(mockDatabaseService.client.pipeline.delete).toHaveBeenCalledWith({
        where: { id: pipelineId },
      });
      expect(result).toEqual({ message: 'Pipeline deleted successfully' });
    });

    it('should throw error when pipeline not found', async () => {
      mockDatabaseService.client.pipeline.findFirst.mockResolvedValue(null);

      await expect(service.deletePipeline(companyId, 'non-existent-id')).rejects.toThrow(
        'Pipeline not found',
      );
    });
  });
});