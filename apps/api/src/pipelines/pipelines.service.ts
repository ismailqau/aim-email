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
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class PipelinesService {
  constructor(
    private readonly database: DatabaseService,
    @InjectQueue('email-pipeline') private pipelineQueue: Queue,
  ) {}

  async createPipeline(companyId: string, pipelineData: any) {
    return this.database.client.pipeline.create({
      data: {
        ...pipelineData,
        companyId,
      },
    });
  }

  async getPipelines(companyId: string) {
    return this.database.client.pipeline.findMany({
      where: { companyId },
      include: {
        pipelineSteps: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPipelineById(companyId: string, pipelineId: string) {
    return this.database.client.pipeline.findFirst({
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
  }

  async startPipeline(pipelineId: string, leadIds: string[]) {
    const pipeline = await this.database.client.pipeline.findUnique({
      where: { id: pipelineId },
      include: {
        pipelineSteps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!pipeline || !pipeline.isActive) {
      throw new Error('Pipeline not found or inactive');
    }

    const executions = [];

    for (const leadId of leadIds) {
      // Create pipeline execution
      const execution = await this.database.client.pipelineExecution.create({
        data: {
          pipelineId,
          leadId,
          status: 'RUNNING',
        },
      });

      // Queue first step
      await this.queueNextStep(execution.id, 0);
      executions.push(execution);
    }

    return {
      message: `Pipeline started for ${leadIds.length} leads`,
      executions,
    };
  }

  async queueNextStep(executionId: string, stepIndex: number) {
    const execution = await this.database.client.pipelineExecution.findUnique({
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

    if (!execution || stepIndex >= execution.pipeline.pipelineSteps.length) {
      // Mark execution as completed
      await this.database.client.pipelineExecution.update({
        where: { id: executionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
      return;
    }

    const step = execution.pipeline.pipelineSteps[stepIndex];
    
    // Create step execution
    const stepExecution = await this.database.client.stepExecution.create({
      data: {
        pipelineExecutionId: executionId,
        stepId: step.id,
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + (step.delayHours * 60 * 60 * 1000)),
      },
    });

    // Add job to queue with delay
    await this.pipelineQueue.add(
      'execute-step',
      {
        stepExecutionId: stepExecution.id,
        executionId,
        stepIndex,
      },
      {
        delay: step.delayHours * 60 * 60 * 1000, // Convert hours to milliseconds
      }
    );
  }

  async updatePipeline(companyId: string, pipelineId: string, updateData: any) {
    const pipeline = await this.database.client.pipeline.findFirst({
      where: { id: pipelineId, companyId },
    });

    if (!pipeline) {
      throw new Error('Pipeline not found');
    }

    return this.database.client.pipeline.update({
      where: { id: pipelineId },
      data: updateData,
    });
  }

  async deletePipeline(companyId: string, pipelineId: string) {
    const pipeline = await this.database.client.pipeline.findFirst({
      where: { id: pipelineId, companyId },
    });

    if (!pipeline) {
      throw new Error('Pipeline not found');
    }

    await this.database.client.pipeline.delete({
      where: { id: pipelineId },
    });

    return { message: 'Pipeline deleted successfully' };
  }
}