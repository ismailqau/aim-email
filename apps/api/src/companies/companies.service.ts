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
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly database: DatabaseService) {}

  async createCompany(userId: string, companyData: any) {
    return this.database.client.company.create({
      data: {
        ...companyData,
        userId,
      },
    });
  }

  async getCompanies(userId: string) {
    return this.database.client.company.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompanyById(userId: string, companyId: string) {
    return this.database.client.company.findFirst({
      where: { id: companyId, userId },
    });
  }

  async updateCompany(userId: string, companyId: string, updateData: any) {
    return this.database.client.company.update({
      where: { id: companyId },
      data: updateData,
    });
  }

  async deleteCompany(userId: string, companyId: string) {
    await this.database.client.company.delete({
      where: { id: companyId },
    });

    return { message: 'Company deleted successfully' };
  }
}