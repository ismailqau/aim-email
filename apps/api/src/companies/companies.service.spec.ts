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
import { CompaniesService } from './companies.service';
import { DatabaseService } from '../common/database/database.service';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    client: {
      company: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompany', () => {
    const userId = 'user-1';
    const companyData = {
      name: 'Test Company',
      industry: 'Technology',
      website: 'https://test.com',
    };

    const mockCompany = {
      id: 'company-1',
      ...companyData,
      userId,
      createdAt: new Date(),
    };

    it('should create a company successfully', async () => {
      mockDatabaseService.client.company.create.mockResolvedValue(mockCompany);

      const result = await service.createCompany(userId, companyData);

      expect(mockDatabaseService.client.company.create).toHaveBeenCalledWith({
        data: {
          ...companyData,
          userId,
        },
      });
      expect(result).toEqual(mockCompany);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Database error');
      mockDatabaseService.client.company.create.mockRejectedValue(error);

      await expect(service.createCompany(userId, companyData)).rejects.toThrow(
        error
      );
    });
  });

  describe('getCompanies', () => {
    const userId = 'user-1';
    const mockCompanies = [
      {
        id: 'company-1',
        name: 'Company A',
        industry: 'Tech',
        userId,
        createdAt: new Date('2023-01-01'),
      },
      {
        id: 'company-2',
        name: 'Company B',
        industry: 'Finance',
        userId,
        createdAt: new Date('2023-01-02'),
      },
    ];

    it('should return companies for a user', async () => {
      mockDatabaseService.client.company.findMany.mockResolvedValue(
        mockCompanies
      );

      const result = await service.getCompanies(userId);

      expect(mockDatabaseService.client.company.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockCompanies);
    });

    it('should return empty array when no companies exist', async () => {
      mockDatabaseService.client.company.findMany.mockResolvedValue([]);

      const result = await service.getCompanies(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getCompanyById', () => {
    const userId = 'user-1';
    const companyId = 'company-1';
    const mockCompany = {
      id: companyId,
      name: 'Test Company',
      userId,
      createdAt: new Date(),
    };

    it('should return a company by id', async () => {
      mockDatabaseService.client.company.findFirst.mockResolvedValue(
        mockCompany
      );

      const result = await service.getCompanyById(userId, companyId);

      expect(mockDatabaseService.client.company.findFirst).toHaveBeenCalledWith(
        {
          where: { id: companyId, userId },
        }
      );
      expect(result).toEqual(mockCompany);
    });

    it('should return null when company not found', async () => {
      mockDatabaseService.client.company.findFirst.mockResolvedValue(null);

      const result = await service.getCompanyById(userId, 'non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateCompany', () => {
    const userId = 'user-1';
    const companyId = 'company-1';
    const updateData = {
      name: 'Updated Company',
      industry: 'Updated Industry',
    };

    const mockUpdatedCompany = {
      id: companyId,
      ...updateData,
      userId,
      createdAt: new Date(),
    };

    it('should update a company successfully', async () => {
      mockDatabaseService.client.company.update.mockResolvedValue(
        mockUpdatedCompany
      );

      const result = await service.updateCompany(userId, companyId, updateData);

      expect(mockDatabaseService.client.company.update).toHaveBeenCalledWith({
        where: { id: companyId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedCompany);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockDatabaseService.client.company.update.mockRejectedValue(error);

      await expect(
        service.updateCompany(userId, companyId, updateData)
      ).rejects.toThrow(error);
    });
  });

  describe('deleteCompany', () => {
    const userId = 'user-1';
    const companyId = 'company-1';

    it('should delete a company successfully', async () => {
      mockDatabaseService.client.company.delete.mockResolvedValue({});

      const result = await service.deleteCompany(userId, companyId);

      expect(mockDatabaseService.client.company.delete).toHaveBeenCalledWith({
        where: { id: companyId },
      });
      expect(result).toEqual({ message: 'Company deleted successfully' });
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Delete failed');
      mockDatabaseService.client.company.delete.mockRejectedValue(error);

      await expect(service.deleteCompany(userId, companyId)).rejects.toThrow(
        error
      );
    });
  });
});
