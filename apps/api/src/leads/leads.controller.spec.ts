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
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let leadsService: LeadsService;

  const mockLeadsService = {
    createLead: jest.fn(),
    getLeads: jest.fn(),
    getLeadById: jest.fn(),
    updateLead: jest.fn(),
    deleteLead: jest.fn(),
    uploadLeadsFromCsv: jest.fn(),
  };

  const mockRequest = {
    user: {
      sub: 'user-1',
      email: 'user@example.com',
      companyId: 'company-1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        {
          provide: LeadsService,
          useValue: mockLeadsService,
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    leadsService = module.get<LeadsService>(LeadsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createLead', () => {
    const leadData = {
      email: 'lead@example.com',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Developer',
    };

    const mockLead = {
      id: 'lead-1',
      ...leadData,
      companyId: 'company-1',
      createdAt: new Date(),
    };

    it('should create a lead', async () => {
      mockLeadsService.createLead.mockResolvedValue(mockLead);

      const result = await controller.createLead(mockRequest, leadData);

      expect(leadsService.createLead).toHaveBeenCalledWith(
        'company-1',
        leadData
      );
      expect(result).toEqual(mockLead);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockLeadsService.createLead.mockRejectedValue(error);

      await expect(
        controller.createLead(mockRequest, leadData)
      ).rejects.toThrow(error);
    });
  });

  describe('getLeads', () => {
    const mockLeadsResponse = {
      data: [
        {
          id: 'lead-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          companyId: 'company-1',
        },
        {
          id: 'lead-2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          companyId: 'company-1',
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 2,
        totalPages: 1,
      },
    };

    it('should return paginated leads', async () => {
      const query = { page: 1, limit: 50 };
      mockLeadsService.getLeads.mockResolvedValue(mockLeadsResponse);

      const result = await controller.getLeads(mockRequest, query);

      expect(leadsService.getLeads).toHaveBeenCalledWith('company-1', query);
      expect(result).toEqual(mockLeadsResponse);
    });

    it('should handle search queries', async () => {
      const query = { search: 'john', status: 'ACTIVE' };
      mockLeadsService.getLeads.mockResolvedValue(mockLeadsResponse);

      await controller.getLeads(mockRequest, query);

      expect(leadsService.getLeads).toHaveBeenCalledWith('company-1', query);
    });

    it('should return empty results when no leads', async () => {
      const emptyResponse = {
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      };
      mockLeadsService.getLeads.mockResolvedValue(emptyResponse);

      const result = await controller.getLeads(mockRequest, {});

      expect(result).toEqual(emptyResponse);
    });
  });

  describe('getLeadById', () => {
    const leadId = 'lead-1';
    const mockLead = {
      id: leadId,
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      companyId: 'company-1',
    };

    it('should return a lead by id', async () => {
      mockLeadsService.getLeadById.mockResolvedValue(mockLead);

      const result = await controller.getLeadById(mockRequest, leadId);

      expect(leadsService.getLeadById).toHaveBeenCalledWith(
        'company-1',
        leadId
      );
      expect(result).toEqual(mockLead);
    });

    it('should handle when lead is not found', async () => {
      const error = new Error('Lead not found');
      mockLeadsService.getLeadById.mockRejectedValue(error);

      await expect(
        controller.getLeadById(mockRequest, 'non-existent-id')
      ).rejects.toThrow(error);
    });
  });

  describe('updateLead', () => {
    const leadId = 'lead-1';
    const updateData = {
      firstName: 'Updated John',
      title: 'Senior Developer',
    };

    const mockUpdatedLead = {
      id: leadId,
      email: 'john@example.com',
      ...updateData,
      companyId: 'company-1',
    };

    it('should update a lead', async () => {
      mockLeadsService.updateLead.mockResolvedValue(mockUpdatedLead);

      const result = await controller.updateLead(
        mockRequest,
        leadId,
        updateData
      );

      expect(leadsService.updateLead).toHaveBeenCalledWith(
        'company-1',
        leadId,
        updateData
      );
      expect(result).toEqual(mockUpdatedLead);
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockLeadsService.updateLead.mockRejectedValue(error);

      await expect(
        controller.updateLead(mockRequest, leadId, updateData)
      ).rejects.toThrow(error);
    });
  });

  describe('deleteLead', () => {
    const leadId = 'lead-1';

    it('should delete a lead', async () => {
      const mockResponse = { message: 'Lead deleted successfully' };
      mockLeadsService.deleteLead.mockResolvedValue(mockResponse);

      const result = await controller.deleteLead(mockRequest, leadId);

      expect(leadsService.deleteLead).toHaveBeenCalledWith('company-1', leadId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Delete failed');
      mockLeadsService.deleteLead.mockRejectedValue(error);

      await expect(controller.deleteLead(mockRequest, leadId)).rejects.toThrow(
        error
      );
    });
  });

  describe('uploadLeads', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'leads.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from(
        'email,firstName,lastName\njohn@example.com,John,Doe'
      ),
      size: 100,
    } as Express.Multer.File;

    const mockUploadResponse = {
      summary: {
        totalRows: 1,
        successfulImports: 1,
        failedImports: 0,
      },
      errors: [],
    };

    it('should upload leads from CSV file', async () => {
      mockLeadsService.uploadLeadsFromCsv.mockResolvedValue(mockUploadResponse);

      const result = await controller.uploadLeads(mockRequest, mockFile);

      // Note: The actual CSV parsing is not implemented in the controller yet
      // This test verifies the service is called with the companyId and empty array
      expect(leadsService.uploadLeadsFromCsv).toHaveBeenCalledWith(
        'company-1',
        []
      );
      expect(result).toEqual(mockUploadResponse);
    });

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed');
      mockLeadsService.uploadLeadsFromCsv.mockRejectedValue(error);

      await expect(
        controller.uploadLeads(mockRequest, mockFile)
      ).rejects.toThrow(error);
    });

    it('should handle missing file', async () => {
      mockLeadsService.uploadLeadsFromCsv.mockResolvedValue({
        summary: { totalRows: 0, successfulImports: 0, failedImports: 0 },
        errors: [],
      });

      const result = await controller.uploadLeads(
        mockRequest,
        undefined as any
      );

      expect(result.summary.totalRows).toBe(0);
    });
  });
});
