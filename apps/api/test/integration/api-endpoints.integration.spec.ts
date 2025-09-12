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
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { CompaniesModule } from '../src/companies/companies.module';
import { LeadsModule } from '../src/leads/leads.module';
import { EmailsModule } from '../src/emails/emails.module';
import { PipelinesModule } from '../src/pipelines/pipelines.module';
import { AnalyticsModule } from '../src/analytics/analytics.module';
import { DatabaseService } from '../src/common/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('API Endpoints Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;

  const mockDatabaseService = {
    client: {
      user: { findUnique: jest.fn(), create: jest.fn() },
      company: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
      lead: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
      },
      pipeline: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      email: { create: jest.fn(), count: jest.fn() },
      emailTemplate: { create: jest.fn(), findMany: jest.fn() },
      emailEvent: { groupBy: jest.fn() },
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        GEMINI_API_KEY: 'test-key',
        SENDGRID_API_KEY: 'SG.test',
        FROM_EMAIL: 'test@example.com',
      };
      return config[key];
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        CompaniesModule,
        LeadsModule,
        EmailsModule,
        PipelinesModule,
        AnalyticsModule,
      ],
      providers: [
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'BullQueue_email-pipeline',
          useValue: { add: jest.fn() },
        },
      ],
    })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(() => 'test-token'),
        verify: jest.fn(() => ({ sub: 'user-1', email: 'test@example.com' })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token for authenticated requests
    authToken = 'Bearer test-token';
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        };

        const mockUser = {
          id: 'user-1',
          ...userData,
          createdAt: new Date(),
        };

        mockDatabaseService.client.user.findUnique.mockResolvedValue(null);
        mockDatabaseService.client.user.create.mockResolvedValue(mockUser);

        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(userData.email);
      });

      it('should validate required fields', async () => {
        const invalidData = {
          name: 'John Doe',
          // email missing
          password: 'short',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(invalidData)
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', async () => {
        const credentials = {
          email: 'john@example.com',
          password: 'password123',
        };

        const mockUser = {
          id: 'user-1',
          email: 'john@example.com',
          password: 'hashedPassword',
          name: 'John Doe',
          createdAt: new Date(),
        };

        mockDatabaseService.client.user.findUnique.mockResolvedValue(mockUser);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(credentials)
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
      });
    });
  });

  describe('Companies Endpoints', () => {
    describe('POST /companies', () => {
      it('should create a company with authentication', async () => {
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

        mockDatabaseService.client.company.create.mockResolvedValue(
          mockCompany
        );

        const response = await request(app.getHttpServer())
          .post('/companies')
          .set('Authorization', authToken)
          .send(companyData)
          .expect(201);

        expect(response.body.id).toBe('company-1');
        expect(response.body.name).toBe(companyData.name);
      });

      it('should require authentication', async () => {
        const companyData = {
          name: 'Test Company',
          industry: 'Technology',
        };

        await request(app.getHttpServer())
          .post('/companies')
          .send(companyData)
          .expect(401);
      });
    });

    describe('GET /companies', () => {
      it('should return user companies', async () => {
        const mockCompanies = [
          {
            id: 'company-1',
            name: 'Company A',
            userId: 'user-1',
            createdAt: new Date(),
          },
        ];

        mockDatabaseService.client.company.findMany.mockResolvedValue(
          mockCompanies
        );

        const response = await request(app.getHttpServer())
          .get('/companies')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Company A');
      });
    });
  });

  describe('Leads Endpoints', () => {
    describe('POST /leads', () => {
      it('should create a lead', async () => {
        const leadData = {
          email: 'lead@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          title: 'Manager',
        };

        const mockLead = {
          id: 'lead-1',
          ...leadData,
          companyId: 'company-1',
          createdAt: new Date(),
        };

        mockDatabaseService.client.lead.findFirst.mockResolvedValue(null);
        mockDatabaseService.client.lead.create.mockResolvedValue(mockLead);

        const response = await request(app.getHttpServer())
          .post('/leads')
          .set('Authorization', authToken)
          .send(leadData)
          .expect(201);

        expect(response.body.email).toBe(leadData.email);
      });
    });

    describe('GET /leads', () => {
      it('should return paginated leads', async () => {
        const mockLeads = [
          {
            id: 'lead-1',
            email: 'lead1@example.com',
            firstName: 'John',
            companyId: 'company-1',
          },
        ];

        mockDatabaseService.client.lead.findMany.mockResolvedValue(mockLeads);
        mockDatabaseService.client.lead.count.mockResolvedValue(1);

        const response = await request(app.getHttpServer())
          .get('/leads')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.data).toHaveLength(1);
      });

      it('should handle search queries', async () => {
        mockDatabaseService.client.lead.findMany.mockResolvedValue([]);
        mockDatabaseService.client.lead.count.mockResolvedValue(0);

        const response = await request(app.getHttpServer())
          .get('/leads?search=john&status=ACTIVE')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body.data).toHaveLength(0);
      });
    });
  });

  describe('Emails Endpoints', () => {
    describe('POST /emails/generate', () => {
      it('should generate AI email content', async () => {
        const generateData = {
          leadId: 'lead-1',
          context: { length: 'short' },
        };

        const mockLead = {
          id: 'lead-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: { name: 'Test Company' },
        };

        mockDatabaseService.client.lead.findUnique.mockResolvedValue(mockLead);

        const response = await request(app.getHttpServer())
          .post('/emails/generate')
          .set('Authorization', authToken)
          .send(generateData)
          .expect(201);

        expect(response.body).toHaveProperty('subject');
        expect(response.body).toHaveProperty('content');
      });
    });

    describe('GET /emails/templates', () => {
      it('should return email templates', async () => {
        const mockTemplates = [
          {
            id: 'template-1',
            name: 'Welcome Email',
            subject: 'Welcome!',
            companyId: 'company-1',
          },
        ];

        mockDatabaseService.client.emailTemplate.findMany.mockResolvedValue(
          mockTemplates
        );

        const response = await request(app.getHttpServer())
          .get('/emails/templates')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Welcome Email');
      });
    });
  });

  describe('Pipelines Endpoints', () => {
    describe('POST /pipelines', () => {
      it('should create a pipeline', async () => {
        const pipelineData = {
          name: 'Welcome Series',
          description: 'New customer pipeline',
          isActive: true,
        };

        const mockPipeline = {
          id: 'pipeline-1',
          ...pipelineData,
          companyId: 'company-1',
          createdAt: new Date(),
        };

        mockDatabaseService.client.pipeline.create.mockResolvedValue(
          mockPipeline
        );

        const response = await request(app.getHttpServer())
          .post('/pipelines')
          .set('Authorization', authToken)
          .send(pipelineData)
          .expect(201);

        expect(response.body.name).toBe(pipelineData.name);
      });
    });

    describe('POST /pipelines/:id/start', () => {
      it('should start pipeline for leads', async () => {
        const pipelineId = 'pipeline-1';
        const data = { leadIds: ['lead-1', 'lead-2'] };

        const mockPipeline = {
          id: pipelineId,
          isActive: true,
          pipelineSteps: [{ id: 'step-1', order: 1, delayHours: 0 }],
        };

        const mockExecutions = [
          { id: 'exec-1', pipelineId, leadId: 'lead-1', status: 'RUNNING' },
          { id: 'exec-2', pipelineId, leadId: 'lead-2', status: 'RUNNING' },
        ];

        mockDatabaseService.client.pipeline.findUnique.mockResolvedValue(
          mockPipeline
        );
        mockDatabaseService.client.pipelineExecution.create
          .mockResolvedValueOnce(mockExecutions[0])
          .mockResolvedValueOnce(mockExecutions[1]);

        const response = await request(app.getHttpServer())
          .post(`/pipelines/${pipelineId}/start`)
          .set('Authorization', authToken)
          .send(data)
          .expect(201);

        expect(response.body.message).toContain('Pipeline started for 2 leads');
      });
    });
  });

  describe('Analytics Endpoints', () => {
    describe('GET /analytics/dashboard', () => {
      it('should return dashboard metrics', async () => {
        mockDatabaseService.client.lead.count
          .mockResolvedValueOnce(100)
          .mockResolvedValueOnce(85);
        mockDatabaseService.client.email.count.mockResolvedValue(50);
        mockDatabaseService.client.emailEvent.groupBy.mockResolvedValue([
          { eventType: 'OPENED', _count: 35 },
          { eventType: 'CLICKED', _count: 15 },
        ]);

        const response = await request(app.getHttpServer())
          .get('/analytics/dashboard')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveProperty('totalLeads');
        expect(response.body).toHaveProperty('activeLeads');
        expect(response.body).toHaveProperty('emailsSent');
        expect(response.body).toHaveProperty('openRate');
        expect(response.body).toHaveProperty('clickRate');
      });
    });

    describe('GET /analytics/performance', () => {
      it('should return performance data with date filters', async () => {
        const mockEmails = [
          {
            id: 'email-1',
            sentAt: new Date('2023-01-15'),
            emailEvents: [{ eventType: 'OPENED' }],
          },
        ];

        mockDatabaseService.client.email.findMany.mockResolvedValue(mockEmails);

        const response = await request(app.getHttpServer())
          .get('/analytics/performance?startDate=2023-01-01&endDate=2023-01-31')
          .set('Authorization', authToken)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      await request(app.getHttpServer())
        .get('/non-existent-endpoint')
        .set('Authorization', authToken)
        .expect(404);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        // missing required fields
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400);
    });

    it('should handle database errors gracefully', async () => {
      mockDatabaseService.client.company.create.mockRejectedValue(
        new Error('Database connection failed')
      );

      const companyData = {
        name: 'Test Company',
        industry: 'Technology',
      };

      await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', authToken)
        .send(companyData)
        .expect(500);
    });
  });
});
