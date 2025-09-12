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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { DatabaseService } from '../common/database/database.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    client: {
      lead: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLead', () => {
    const companyId = 'company-1';
    const leadData = {
      email: 'lead@example.com',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Developer',
      companyName: 'Test Co',
    };

    const mockLead = {
      id: 'lead-1',
      ...leadData,
      companyId,
      priorityScore: 50,
      createdAt: new Date(),
    };

    it('should create a lead successfully', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);
      mockDatabaseService.client.lead.create.mockResolvedValue(mockLead);

      const result = await service.createLead(companyId, leadData);

      expect(mockDatabaseService.client.lead.findFirst).toHaveBeenCalledWith({
        where: { companyId, email: leadData.email },
      });
      expect(mockDatabaseService.client.lead.create).toHaveBeenCalledWith({
        data: { ...leadData, companyId, priorityScore: 50 },
      });
      expect(result).toEqual(mockLead);
    });

    it('should use custom priority score when provided', async () => {
      const leadWithPriority = { ...leadData, priorityScore: 80 };
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);
      mockDatabaseService.client.lead.create.mockResolvedValue({
        ...mockLead,
        priorityScore: 80,
      });

      await service.createLead(companyId, leadWithPriority);

      expect(mockDatabaseService.client.lead.create).toHaveBeenCalledWith({
        data: { ...leadWithPriority, companyId },
      });
    });

    it('should throw BadRequestException if lead with email already exists', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(mockLead);

      await expect(service.createLead(companyId, leadData)).rejects.toThrow(
        new BadRequestException('Lead with this email already exists')
      );

      expect(mockDatabaseService.client.lead.create).not.toHaveBeenCalled();
    });
  });

  describe('getLeads', () => {
    const companyId = 'company-1';
    const mockLeads = [
      {
        id: 'lead-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        companyId,
        createdAt: new Date(),
      },
      {
        id: 'lead-2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        companyId,
        createdAt: new Date(),
      },
    ];

    it('should return paginated leads with default params', async () => {
      mockDatabaseService.client.lead.findMany.mockResolvedValue(mockLeads);
      mockDatabaseService.client.lead.count.mockResolvedValue(2);

      const result = await service.getLeads(companyId);

      expect(mockDatabaseService.client.lead.findMany).toHaveBeenCalledWith({
        where: { companyId },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
      expect(mockDatabaseService.client.lead.count).toHaveBeenCalledWith({
        where: { companyId },
      });
      expect(result).toEqual({
        data: mockLeads,
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it('should handle pagination parameters', async () => {
      const query = { page: 2, limit: 10 };
      mockDatabaseService.client.lead.findMany.mockResolvedValue([]);
      mockDatabaseService.client.lead.count.mockResolvedValue(0);

      await service.getLeads(companyId, query);

      expect(mockDatabaseService.client.lead.findMany).toHaveBeenCalledWith({
        where: { companyId },
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle search query', async () => {
      const query = { search: 'john' };
      mockDatabaseService.client.lead.findMany.mockResolvedValue([
        mockLeads[0],
      ]);
      mockDatabaseService.client.lead.count.mockResolvedValue(1);

      await service.getLeads(companyId, query);

      expect(mockDatabaseService.client.lead.findMany).toHaveBeenCalledWith({
        where: {
          companyId,
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle status filter', async () => {
      const query = { status: 'ACTIVE' };
      mockDatabaseService.client.lead.findMany.mockResolvedValue([]);
      mockDatabaseService.client.lead.count.mockResolvedValue(0);

      await service.getLeads(companyId, query);

      expect(mockDatabaseService.client.lead.findMany).toHaveBeenCalledWith({
        where: { companyId, status: 'ACTIVE' },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getLeadById', () => {
    const companyId = 'company-1';
    const leadId = 'lead-1';
    const mockLead = {
      id: leadId,
      email: 'john@example.com',
      firstName: 'John',
      companyId,
      createdAt: new Date(),
    };

    it('should return a lead by id', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(mockLead);

      const result = await service.getLeadById(companyId, leadId);

      expect(mockDatabaseService.client.lead.findFirst).toHaveBeenCalledWith({
        where: { id: leadId, companyId },
      });
      expect(result).toEqual(mockLead);
    });

    it('should throw NotFoundException when lead not found', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);

      await expect(
        service.getLeadById(companyId, 'non-existent-id')
      ).rejects.toThrow(new NotFoundException('Lead not found'));
    });
  });

  describe('updateLead', () => {
    const companyId = 'company-1';
    const leadId = 'lead-1';
    const updateData = {
      firstName: 'Updated John',
      title: 'Senior Developer',
    };

    const mockLead = {
      id: leadId,
      email: 'john@example.com',
      firstName: 'John',
      companyId,
      createdAt: new Date(),
    };

    const mockUpdatedLead = {
      ...mockLead,
      ...updateData,
    };

    it('should update a lead successfully', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(mockLead);
      mockDatabaseService.client.lead.update.mockResolvedValue(mockUpdatedLead);

      const result = await service.updateLead(companyId, leadId, updateData);

      expect(mockDatabaseService.client.lead.update).toHaveBeenCalledWith({
        where: { id: leadId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedLead);
    });

    it('should throw NotFoundException when lead not found', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);

      await expect(
        service.updateLead(companyId, 'non-existent-id', updateData)
      ).rejects.toThrow(new NotFoundException('Lead not found'));
    });
  });

  describe('deleteLead', () => {
    const companyId = 'company-1';
    const leadId = 'lead-1';
    const mockLead = {
      id: leadId,
      email: 'john@example.com',
      companyId,
      createdAt: new Date(),
    };

    it('should delete a lead successfully', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(mockLead);
      mockDatabaseService.client.lead.delete.mockResolvedValue({});

      const result = await service.deleteLead(companyId, leadId);

      expect(mockDatabaseService.client.lead.delete).toHaveBeenCalledWith({
        where: { id: leadId },
      });
      expect(result).toEqual({ message: 'Lead deleted successfully' });
    });

    it('should throw NotFoundException when lead not found', async () => {
      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteLead(companyId, 'non-existent-id')
      ).rejects.toThrow(new NotFoundException('Lead not found'));
    });
  });

  describe('uploadLeadsFromCsv', () => {
    const companyId = 'company-1';

    it('should successfully import valid CSV data', async () => {
      const csvData = [
        {
          email: 'lead1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          title: 'Developer',
        },
        {
          email: 'lead2@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          company_name: 'Test Corp',
        },
      ];

      const mockLead1 = { id: 'lead-1', ...csvData[0], companyId };
      const mockLead2 = { id: 'lead-2', ...csvData[1], companyId };

      mockDatabaseService.client.lead.findFirst
        .mockResolvedValueOnce(null) // First lead doesn't exist
        .mockResolvedValueOnce(null); // Second lead doesn't exist

      mockDatabaseService.client.lead.create
        .mockResolvedValueOnce(mockLead1)
        .mockResolvedValueOnce(mockLead2);

      const result = await service.uploadLeadsFromCsv(companyId, csvData);

      expect(result.summary).toEqual({
        totalRows: 2,
        successfulImports: 2,
        failedImports: 0,
      });
      expect(result.errors).toEqual([]);
    });

    it('should handle invalid email addresses', async () => {
      const csvData = [
        { email: 'invalid-email', firstName: 'John' },
        { email: 'valid@example.com', firstName: 'Jane' },
      ];

      mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);
      mockDatabaseService.client.lead.create.mockResolvedValue({
        id: 'lead-1',
      });

      const result = await service.uploadLeadsFromCsv(companyId, csvData);

      expect(result.summary).toEqual({
        totalRows: 2,
        successfulImports: 1,
        failedImports: 1,
      });
      expect(result.errors).toContain('Row 1: Invalid email');
    });

    it('should handle duplicate leads', async () => {
      const csvData = [{ email: 'existing@example.com', firstName: 'John' }];

      mockDatabaseService.client.lead.findFirst.mockResolvedValue({
        id: 'existing-lead',
      });

      const result = await service.uploadLeadsFromCsv(companyId, csvData);

      expect(result.summary).toEqual({
        totalRows: 1,
        successfulImports: 0,
        failedImports: 1,
      });
      expect(result.errors).toContain(
        'Row 1: Lead with this email already exists'
      );
    });

    it('should limit error messages to 20', async () => {
      const csvData = Array.from({ length: 25 }, (_, i) => ({
        email: 'invalid-email',
        firstName: `User${i}`,
      }));

      const result = await service.uploadLeadsFromCsv(companyId, csvData);

      expect(result.errors).toHaveLength(20);
      expect(result.summary.failedImports).toBe(25);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses correctly', () => {
      // Access private method through any
      const serviceAny = service as any;

      expect(serviceAny.isValidEmail('valid@example.com')).toBe(true);
      expect(serviceAny.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(serviceAny.isValidEmail('invalid-email')).toBe(false);
      expect(serviceAny.isValidEmail('missing@domain')).toBe(false);
      expect(serviceAny.isValidEmail('@domain.com')).toBe(false);
      expect(serviceAny.isValidEmail('user@')).toBe(false);
    });
  });
});
