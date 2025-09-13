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
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

interface CustomRequest extends ExpressRequest {
  user: { companyId: string };
}
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  async getDashboard(@Request() req: CustomRequest) {
    return this.analyticsService.getDashboardMetrics(req.user.companyId);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance data' })
  async getPerformance(@Request() req: CustomRequest, @Query() params: any) {
    return this.analyticsService.getPerformanceData(
      req.user.companyId,
      params.startDate,
      params.endDate
    );
  }

  @Get('pipelines')
  @ApiOperation({ summary: 'Get pipeline metrics' })
  async getPipelineMetrics(@Request() req: CustomRequest) {
    return this.analyticsService.getPipelineMetrics(req.user.companyId);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export analytics data' })
  async exportData(@Request() req: CustomRequest, @Body() params: any) {
    return this.analyticsService.exportData(
      req.user.companyId,
      params.type,
      params
    );
  }
}
