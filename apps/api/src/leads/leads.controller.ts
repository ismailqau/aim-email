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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';

interface CustomRequest extends ExpressRequest {
  user: {
    companyId: string;
  };
}

interface LeadCsvData {
  [key: string]: string;
}
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  async createLead(@Request() req: CustomRequest, @Body() leadData: any) {
    return this.leadsService.createLead(req.user.companyId, leadData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  async getLeads(@Request() req: CustomRequest, @Query() query: any) {
    return this.leadsService.getLeads(req.user.companyId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  async getLeadById(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.leadsService.getLeadById(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  async updateLead(
    @Request() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.leadsService.updateLead(req.user.companyId, id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  async deleteLead(@Request() req: CustomRequest, @Param('id') id: string) {
    return this.leadsService.deleteLead(req.user.companyId, id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload leads from CSV file' })
  async uploadLeads(
    @Request() req: CustomRequest,
    @UploadedFile() _file: Express.Multer.File
  ) {
    // Parse CSV data here and pass to service
    const csvData: LeadCsvData[] = []; // TODO: Parse CSV file
    return this.leadsService.uploadLeadsFromCsv(req.user.companyId, csvData);
  }
}
