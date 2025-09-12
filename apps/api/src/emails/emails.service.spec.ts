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
import { ConfigService } from '@nestjs/config';
import { EmailsService } from './emails.service';
import { DatabaseService } from '../common/database/database.service';

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('{"subject": "Test Subject", "content": "Test Content"}'),
        },
      }),
    }),
  })),
}));

describe('EmailsService', () => {
  let service: EmailsService;
  let databaseService: DatabaseService;
  let configService: ConfigService;

  const mockDatabaseService = {
    client: {
      lead: {
        findUnique: jest.fn(),
      },
      emailTemplate: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      email: {
        create: jest.fn(),
      },
    },
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    configService = module.get<ConfigService>(ConfigService);

    // Setup default config mock
    mockConfigService.get.mockReturnValue('mock-api-key');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateEmailContent', () => {
    const leadId = 'lead-1';
    const mockLead = {
      id: leadId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      title: 'Developer',
      companyName: 'Test Corp',
      company: {
        name: 'My Company',
        industry: 'Technology',
        website: 'https://mycompany.com',
      },
    };

    it('should generate email content successfully', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);

      const result = await service.generateEmailContent(leadId);

      expect(mockDatabaseService.client.lead.findUnique).toHaveBeenCalledWith({
        where: { id: leadId },
        include: { company: true },
      });
      expect(result).toEqual({
        subject: 'Test Subject',
        content: 'Test Content',
      });
    });

    it('should generate email content with custom context', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);
      const context = {
        length: 'short',
        purpose: 'follow-up',
      };

      const result = await service.generateEmailContent(leadId, context);

      expect(result).toEqual({
        subject: 'Test Subject',
        content: 'Test Content',
      });
    });

    it('should throw error when lead not found', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(null);

      await expect(service.generateEmailContent('non-existent-lead')).rejects.toThrow(
        'Lead not found',
      );
    });

    it('should handle AI generation failure', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);
      
      // Mock AI failure
      const mockModel = {
        generateContent: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      
      (service as any).genAI = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel),
      };

      await expect(service.generateEmailContent(leadId)).rejects.toThrow(
        'AI generation failed: API Error',
      );
    });

    it('should handle invalid JSON response from AI', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);
      
      const mockModel = {
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue('Invalid JSON response'),
          },
        }),
      };
      
      (service as any).genAI = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel),
      };

      const result = await service.generateEmailContent(leadId);

      expect(result).toEqual({
        subject: 'Personalized Outreach',
        content: 'Invalid JSON response',
      });
    });

    it('should parse subject from non-JSON response', async () => {
      mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);
      
      const mockModel = {
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue('Subject: Custom Subject\n\nEmail body content here'),
          },
        }),
      };
      
      (service as any).genAI = {
        getGenerativeModel: jest.fn().mockReturnValue(mockModel),
      };

      const result = await service.generateEmailContent(leadId);

      expect(result).toEqual({
        subject: 'Custom Subject',
        content: 'Email body content here',
      });
    });
  });

  describe('createEmailTemplate', () => {
    const companyId = 'company-1';
    const templateData = {
      name: 'Welcome Email',
      subject: 'Welcome to our platform',
      content: 'Thank you for joining us!',
      type: 'WELCOME',
    };

    const mockTemplate = {
      id: 'template-1',
      ...templateData,
      companyId,
      aiGenerated: false,
      createdAt: new Date(),
    };

    it('should create email template successfully', async () => {
      mockDatabaseService.client.emailTemplate.create.mockResolvedValue(mockTemplate);

      const result = await service.createEmailTemplate(companyId, templateData);

      expect(mockDatabaseService.client.emailTemplate.create).toHaveBeenCalledWith({
        data: {
          ...templateData,
          companyId,
          aiGenerated: false,
        },
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should create AI-generated template', async () => {
      const aiTemplateData = { ...templateData, aiGenerated: true };
      const mockAiTemplate = { ...mockTemplate, aiGenerated: true };
      
      mockDatabaseService.client.emailTemplate.create.mockResolvedValue(mockAiTemplate);

      const result = await service.createEmailTemplate(companyId, aiTemplateData);

      expect(mockDatabaseService.client.emailTemplate.create).toHaveBeenCalledWith({
        data: {
          ...aiTemplateData,
          companyId,
        },
      });
      expect(result.aiGenerated).toBe(true);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Database error');
      mockDatabaseService.client.emailTemplate.create.mockRejectedValue(error);

      await expect(service.createEmailTemplate(companyId, templateData)).rejects.toThrow(error);
    });
  });

  describe('getEmailTemplates', () => {
    const companyId = 'company-1';
    const mockTemplates = [
      {
        id: 'template-1',
        name: 'Welcome Email',
        subject: 'Welcome',
        companyId,
        createdAt: new Date('2023-01-01'),
      },
      {
        id: 'template-2',
        name: 'Follow-up Email',
        subject: 'Follow-up',
        companyId,
        createdAt: new Date('2023-01-02'),
      },
    ];

    it('should return email templates for company', async () => {
      mockDatabaseService.client.emailTemplate.findMany.mockResolvedValue(mockTemplates);

      const result = await service.getEmailTemplates(companyId);

      expect(mockDatabaseService.client.emailTemplate.findMany).toHaveBeenCalledWith({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTemplates);
    });

    it('should return empty array when no templates', async () => {
      mockDatabaseService.client.emailTemplate.findMany.mockResolvedValue([]);

      const result = await service.getEmailTemplates(companyId);

      expect(result).toEqual([]);
    });
  });

  describe('sendEmail', () => {
    const leadId = 'lead-1';
    const emailData = {
      subject: 'Test Email',
      content: 'This is a test email content',
    };

    const mockEmail = {
      id: 'email-1',
      leadId,
      subject: emailData.subject,
      content: emailData.content,
      status: 'SCHEDULED',
      createdAt: new Date(),
    };

    it('should create email record successfully', async () => {
      mockDatabaseService.client.email.create.mockResolvedValue(mockEmail);

      const result = await service.sendEmail(leadId, emailData);

      expect(mockDatabaseService.client.email.create).toHaveBeenCalledWith({
        data: {
          leadId,
          subject: emailData.subject,
          content: emailData.content,
          status: 'SCHEDULED',
        },
      });
      expect(result).toEqual(mockEmail);
    });

    it('should handle email creation errors', async () => {
      const error = new Error('Email creation failed');
      mockDatabaseService.client.email.create.mockRejectedValue(error);

      await expect(service.sendEmail(leadId, emailData)).rejects.toThrow(error);
    });
  });

  describe('buildEmailPrompt', () => {
    it('should build proper email prompt', () => {
      const mockLead = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        title: 'Developer',
        companyName: 'Test Corp',
        company: {
          name: 'My Company',
          industry: 'Technology',
          website: 'https://mycompany.com',
        },
      };

      const context = {
        length: 'short',
        purpose: 'introduction',
      };

      // Access private method through any
      const serviceAny = service as any;
      const prompt = serviceAny.buildEmailPrompt(mockLead, context);

      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('john@example.com');
      expect(prompt).toContain('Developer');
      expect(prompt).toContain('Test Corp');
      expect(prompt).toContain('My Company');
      expect(prompt).toContain('Technology');
      expect(prompt).toContain('short');
      expect(prompt).toContain('introduction');
    });
  });

  describe('parseEmailContent', () => {
    it('should parse valid JSON response', () => {
      const jsonResponse = '{"subject": "Test Subject", "content": "Test Content"}';
      
      // Access private method through any
      const serviceAny = service as any;
      const result = serviceAny.parseEmailContent(jsonResponse);

      expect(result).toEqual({
        subject: 'Test Subject',
        content: 'Test Content',
      });
    });

    it('should parse JSON from mixed response', () => {
      const mixedResponse = 'Some text before\n{"subject": "Test Subject", "content": "Test Content"}\nSome text after';
      
      const serviceAny = service as any;
      const result = serviceAny.parseEmailContent(mixedResponse);

      expect(result).toEqual({
        subject: 'Test Subject',
        content: 'Test Content',
      });
    });

    it('should extract subject from text response', () => {
      const textResponse = 'Subject: Custom Subject\n\nThis is the email content';
      
      const serviceAny = service as any;
      const result = serviceAny.parseEmailContent(textResponse);

      expect(result).toEqual({
        subject: 'Custom Subject',
        content: 'This is the email content',
      });
    });

    it('should handle plain text response', () => {
      const plainResponse = 'This is just plain email content';
      
      const serviceAny = service as any;
      const result = serviceAny.parseEmailContent(plainResponse);

      expect(result).toEqual({
        subject: 'Personalized Outreach',
        content: 'This is just plain email content',
      });
    });
  });
});