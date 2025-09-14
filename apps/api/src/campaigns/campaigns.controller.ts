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
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface CustomRequest extends ExpressRequest {
  user: {
    companyId: string;
  };
}

@ApiTags('Campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  async createCampaign(
    @Request() req: CustomRequest,
    @Body() campaignData: any
  ) {
    return this.campaignsService.createCampaign(
      req.user.companyId,
      campaignData
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  async getCampaigns(@Request() req: CustomRequest, @Query() query: any) {
    return this.campaignsService.getCampaigns(req.user.companyId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async getCampaignById(
    @Request() req: CustomRequest,
    @Param('id') id: string
  ) {
    return this.campaignsService.getCampaignById(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  async updateCampaign(
    @Request() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.campaignsService.updateCampaign(
      req.user.companyId,
      id,
      updateData
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign' })
  async deleteCampaign(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.campaignsService.deleteCampaign(req.user.companyId, id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start campaign execution' })
  async startCampaign(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.campaignsService.startCampaign(req.user.companyId, id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause campaign execution' })
  async pauseCampaign(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.campaignsService.pauseCampaign(req.user.companyId, id);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get campaign analytics' })
  async getCampaignAnalytics(
    @Request() req: CustomRequest,
    @Param('id') id: string
  ) {
    return this.campaignsService.getCampaignAnalytics(req.user.companyId, id);
  }

  // Template management endpoints
  @Get('templates/list')
  @ApiOperation({ summary: 'Get all email templates' })
  async getTemplates(@Request() req: CustomRequest, @Query() query: any) {
    return this.campaignsService.getTemplates(req.user.companyId, query);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create email template' })
  async createTemplate(
    @Request() req: CustomRequest,
    @Body() templateData: any
  ) {
    return this.campaignsService.createTemplate(
      req.user.companyId,
      templateData
    );
  }

  @Put('templates/:templateId')
  @ApiOperation({ summary: 'Update email template' })
  async updateTemplate(
    @Request() req: CustomRequest,
    @Param('templateId') templateId: string,
    @Body() updateData: any
  ) {
    return this.campaignsService.updateTemplate(
      req.user.companyId,
      templateId,
      updateData
    );
  }

  @Delete('templates/:templateId')
  @ApiOperation({ summary: 'Delete email template' })
  async deleteTemplate(
    @Request() req: CustomRequest,
    @Param('templateId') templateId: string
  ) {
    return this.campaignsService.deleteTemplate(req.user.companyId, templateId);
  }
}
