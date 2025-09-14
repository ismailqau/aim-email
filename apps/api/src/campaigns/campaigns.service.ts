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
export class CampaignsService {
  constructor(private readonly database: DatabaseService) {}

  async createCampaign(companyId: string, campaignData: any) {
    const { name, description, templateIds, settings } = campaignData;

    // Validate templates exist
    if (templateIds && templateIds.length > 0) {
      const templates = await this.database.client.emailTemplate.findMany({
        where: {
          id: { in: templateIds },
          companyId,
        },
      });

      if (templates.length !== templateIds.length) {
        throw new BadRequestException('One or more templates not found');
      }
    }

    // Create pipeline (campaign)
    const pipeline = await this.database.client.pipeline.create({
      data: {
        companyId,
        name,
        description,
        steps: {},
        isActive: false, // Start as inactive
        pipelineSteps: templateIds
          ? {
              create: templateIds.map((templateId: string, index: number) => ({
                templateId,
                order: index + 1,
                delayHours: settings?.stepDelays?.[index] || 0,
                stepType: 'EMAIL',
              })),
            }
          : undefined,
      },
      include: {
        pipelineSteps: {
          include: {
            emailTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return pipeline;
  }

  async getCampaigns(companyId: string, query: any = {}) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== undefined) {
      where.isActive = status === 'active';
    }

    const [campaigns, total] = await Promise.all([
      this.database.client.pipeline.findMany({
        where,
        skip,
        take: limit,
        include: {
          pipelineSteps: {
            include: {
              emailTemplate: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          pipelineExecutions: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.client.pipeline.count({ where }),
    ]);

    // Add campaign statistics
    const campaignsWithStats = await Promise.all(
      campaigns.map(async campaign => {
        const stats = await this.getCampaignStats(campaign.id);
        return {
          ...campaign,
          stats,
        };
      })
    );

    return {
      data: campaignsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignById(companyId: string, id: string) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
      include: {
        pipelineSteps: {
          include: {
            emailTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        pipelineExecutions: {
          include: {
            lead: true,
            stepExecutions: {
              include: {
                step: {
                  include: {
                    emailTemplate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const stats = await this.getCampaignStats(id);

    return {
      ...campaign,
      stats,
    };
  }

  async updateCampaign(companyId: string, id: string, updateData: any) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return this.database.client.pipeline.update({
      where: { id },
      data: updateData,
      include: {
        pipelineSteps: {
          include: {
            emailTemplate: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async deleteCampaign(companyId: string, id: string) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check if campaign has active executions
    const activeExecutions = await this.database.client.pipelineExecution.count(
      {
        where: {
          pipelineId: id,
          status: 'RUNNING',
        },
      }
    );

    if (activeExecutions > 0) {
      throw new BadRequestException(
        'Cannot delete campaign with active executions'
      );
    }

    return this.database.client.pipeline.delete({
      where: { id },
    });
  }

  async startCampaign(companyId: string, id: string) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
      include: {
        pipelineSteps: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.pipelineSteps.length === 0) {
      throw new BadRequestException('Campaign must have at least one step');
    }

    // Update campaign status
    await this.database.client.pipeline.update({
      where: { id },
      data: { isActive: true },
    });

    return { message: 'Campaign started successfully' };
  }

  async pauseCampaign(companyId: string, id: string) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.database.client.pipeline.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Campaign paused successfully' };
  }

  async getCampaignAnalytics(companyId: string, id: string) {
    const campaign = await this.database.client.pipeline.findFirst({
      where: { id, companyId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const stats = await this.getCampaignStats(id);

    // Get detailed analytics
    const executions = await this.database.client.pipelineExecution.findMany({
      where: { pipelineId: id },
      include: {
        lead: true,
        stepExecutions: {
          include: {
            step: {
              include: {
                emailTemplate: true,
              },
            },
          },
        },
      },
    });

    // Get pipeline steps for performance calculation
    const pipelineSteps = await this.database.client.pipelineStep.findMany({
      where: { pipelineId: id },
      include: {
        emailTemplate: true,
      },
      orderBy: { order: 'asc' },
    });

    // Calculate performance metrics
    const performanceByStep = pipelineSteps.map((step: any) => {
      const stepExecutions = executions.flatMap(exec =>
        exec.stepExecutions.filter(se => se.stepId === step.id)
      );

      return {
        stepId: step.id,
        stepOrder: step.order,
        templateName: step.emailTemplate?.name,
        totalSent: stepExecutions.filter(se => se.status === 'EXECUTED').length,
        totalScheduled: stepExecutions.filter(se => se.status === 'SCHEDULED')
          .length,
        totalFailed: stepExecutions.filter(se => se.status === 'FAILED').length,
      };
    });

    return {
      ...stats,
      performanceByStep,
      executions: executions.length,
    };
  }

  private async getCampaignStats(campaignId: string) {
    const [
      totalExecutions,
      activeExecutions,
      completedExecutions,
      failedExecutions,
    ] = await Promise.all([
      this.database.client.pipelineExecution.count({
        where: { pipelineId: campaignId },
      }),
      this.database.client.pipelineExecution.count({
        where: { pipelineId: campaignId, status: 'RUNNING' },
      }),
      this.database.client.pipelineExecution.count({
        where: { pipelineId: campaignId, status: 'COMPLETED' },
      }),
      this.database.client.pipelineExecution.count({
        where: { pipelineId: campaignId, status: 'FAILED' },
      }),
    ]);

    return {
      totalExecutions,
      activeExecutions,
      completedExecutions,
      failedExecutions,
      completionRate:
        totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0,
    };
  }

  // Template management methods
  async getTemplates(companyId: string, query: any = {}) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.database.client.emailTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.database.client.emailTemplate.count({ where }),
    ]);

    return {
      data: templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createTemplate(companyId: string, templateData: any) {
    const { name, subject, content, variables } = templateData;

    return this.database.client.emailTemplate.create({
      data: {
        companyId,
        name,
        subject,
        content,
        variables,
        aiGenerated: false,
      },
    });
  }

  async updateTemplate(companyId: string, templateId: string, updateData: any) {
    const template = await this.database.client.emailTemplate.findFirst({
      where: { id: templateId, companyId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.database.client.emailTemplate.update({
      where: { id: templateId },
      data: updateData,
    });
  }

  async deleteTemplate(companyId: string, templateId: string) {
    const template = await this.database.client.emailTemplate.findFirst({
      where: { id: templateId, companyId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template is used in any active campaigns
    const usedInCampaigns = await this.database.client.pipelineStep.count({
      where: {
        templateId,
        pipeline: {
          isActive: true,
        },
      },
    });

    if (usedInCampaigns > 0) {
      throw new BadRequestException(
        'Cannot delete template used in active campaigns'
      );
    }

    return this.database.client.emailTemplate.delete({
      where: { id: templateId },
    });
  }
}
