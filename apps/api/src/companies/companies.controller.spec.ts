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

import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let companiesService: CompaniesService;

  const mockCompaniesService = {
    createCompany: jest.fn(),
    getCompanies: jest.fn(),
    getCompanyById: jest.fn(),
    updateCompany: jest.fn(),
    deleteCompany: jest.fn(),
  };

  const mockRequest = {
    user: {
      sub: 'user-1',
      email: 'user@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    companiesService = module.get<CompaniesService>(CompaniesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCompany', () => {
    const companyData = {
      name: 'Test Company',
      industry: 'Technology',
      website: 'https://test.com',
    };

    const mockCompany = {
      id: 'company-1',
      ...companyData,
      userId: 'user-1',
      createdAt: new Date(),
    };

    it('should create a company', async () => {
      mockCompaniesService.createCompany.mockResolvedValue(mockCompany);

      const result = await controller.createCompany(mockRequest, companyData);

      expect(companiesService.createCompany).toHaveBeenCalledWith(
        'user-1',
        companyData
      );
      expect(result).toEqual(mockCompany);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockCompaniesService.createCompany.mockRejectedValue(error);

      await expect(
        controller.createCompany(mockRequest, companyData)
      ).rejects.toThrow(error);
    });
  });

  describe('getCompanies', () => {
    const mockCompanies = [
      {
        id: 'company-1',
        name: 'Company A',
        industry: 'Tech',
        userId: 'user-1',
        createdAt: new Date(),
      },
      {
        id: 'company-2',
        name: 'Company B',
        industry: 'Finance',
        userId: 'user-1',
        createdAt: new Date(),
      },
    ];

    it('should return all companies for user', async () => {
      mockCompaniesService.getCompanies.mockResolvedValue(mockCompanies);

      const result = await controller.getCompanies(mockRequest);

      expect(companiesService.getCompanies).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockCompanies);
    });

    it('should return empty array when no companies', async () => {
      mockCompaniesService.getCompanies.mockResolvedValue([]);

      const result = await controller.getCompanies(mockRequest);

      expect(result).toEqual([]);
    });
  });

  describe('getCompanyById', () => {
    const companyId = 'company-1';
    const mockCompany = {
      id: companyId,
      name: 'Test Company',
      userId: 'user-1',
      createdAt: new Date(),
    };

    it('should return a company by id', async () => {
      mockCompaniesService.getCompanyById.mockResolvedValue(mockCompany);

      const result = await controller.getCompanyById(mockRequest, companyId);

      expect(companiesService.getCompanyById).toHaveBeenCalledWith(
        'user-1',
        companyId
      );
      expect(result).toEqual(mockCompany);
    });

    it('should return null when company not found', async () => {
      mockCompaniesService.getCompanyById.mockResolvedValue(null);

      const result = await controller.getCompanyById(
        mockRequest,
        'non-existent-id'
      );

      expect(result).toBeNull();
    });
  });

  describe('updateCompany', () => {
    const companyId = 'company-1';
    const updateData = {
      name: 'Updated Company',
      industry: 'Updated Industry',
    };

    const mockUpdatedCompany = {
      id: companyId,
      ...updateData,
      userId: 'user-1',
      createdAt: new Date(),
    };

    it('should update a company', async () => {
      mockCompaniesService.updateCompany.mockResolvedValue(mockUpdatedCompany);

      const result = await controller.updateCompany(
        mockRequest,
        companyId,
        updateData
      );

      expect(companiesService.updateCompany).toHaveBeenCalledWith(
        'user-1',
        companyId,
        updateData
      );
      expect(result).toEqual(mockUpdatedCompany);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockCompaniesService.updateCompany.mockRejectedValue(error);

      await expect(
        controller.updateCompany(mockRequest, companyId, updateData)
      ).rejects.toThrow(error);
    });
  });

  describe('deleteCompany', () => {
    const companyId = 'company-1';

    it('should delete a company', async () => {
      const mockResponse = { message: 'Company deleted successfully' };
      mockCompaniesService.deleteCompany.mockResolvedValue(mockResponse);

      const result = await controller.deleteCompany(mockRequest, companyId);

      expect(companiesService.deleteCompany).toHaveBeenCalledWith(
        'user-1',
        companyId
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Delete failed');
      mockCompaniesService.deleteCompany.mockRejectedValue(error);

      await expect(
        controller.deleteCompany(mockRequest, companyId)
      ).rejects.toThrow(error);
    });
  });
});
