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
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  async createCompany(@Request() req, @Body() companyData: any) {
    return this.companiesService.createCompany(req.user.sub, companyData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async getCompanies(@Request() req) {
    return this.companiesService.getCompanies(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  async getCompanyById(@Request() req, @Param('id') id: string) {
    return this.companiesService.getCompanyById(req.user.sub, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update company' })
  async updateCompany(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    return this.companiesService.updateCompany(req.user.sub, id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  async deleteCompany(@Request() req, @Param('id') id: string) {
    return this.companiesService.deleteCompany(req.user.sub, id);
  }
}