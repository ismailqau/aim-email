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

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PipelinesService } from './pipelines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pipelines')
@Controller('pipelines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pipeline' })
  async createPipeline(@Request() req, @Body() pipelineData: any) {
    return this.pipelinesService.createPipeline(req.user.companyId, pipelineData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pipelines' })
  async getPipelines(@Request() req) {
    return this.pipelinesService.getPipelines(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  async getPipelineById(@Request() req, @Param('id') id: string) {
    return this.pipelinesService.getPipelineById(req.user.companyId, id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start pipeline for leads' })
  async startPipeline(@Param('id') id: string, @Body() data: { leadIds: string[] }) {
    return this.pipelinesService.startPipeline(id, data.leadIds);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async updatePipeline(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    return this.pipelinesService.updatePipeline(req.user.companyId, id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pipeline' })
  async deletePipeline(@Request() req, @Param('id') id: string) {
    return this.pipelinesService.deletePipeline(req.user.companyId, id);
  }
}