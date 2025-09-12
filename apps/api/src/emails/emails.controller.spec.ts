import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { EmailDeliveryService } from './email-delivery.service';
import { EmailProviderService } from './email-provider.service';
import { DnsValidationService } from './dns-validation.service';
import { EmailReputationService } from './email-reputation.service';

describe('EmailsController', () => {
  let controller: EmailsController;
  let emailsService: EmailsService;
  let emailDeliveryService: EmailDeliveryService;
  let emailProviderService: EmailProviderService;
  let dnsValidationService: DnsValidationService;
  let emailReputationService: EmailReputationService;

  const mockEmailsService = {
    generateEmailContent: jest.fn(),
    getEmailTemplates: jest.fn(),
    createEmailTemplate: jest.fn(),
  };

  const mockEmailDeliveryService = {
    testEmailServices: jest.fn(),
    getPreferredProvider: jest.fn(),
  };

  const mockEmailProviderService = {
    sendEmailWithCompanyConfig: jest.fn(),
    configureEmailProvider: jest.fn(),
    getEmailProviderConfig: jest.fn(),
    validateEmailSetup: jest.fn(),
    testEmailConfiguration: jest.fn(),
    generateDKIMKeyPair: jest.fn(),
    getDeliveryStats: jest.fn(),
  };

  const mockDnsValidationService = {
    validateDomainSetup: jest.fn(),
  };

  const mockEmailReputationService = {
    getCompanyReputationMetrics: jest.fn(),
    analyzeDeliveryOptimization: jest.fn(),
    monitorBlacklistStatus: jest.fn(),
    trackEmailDelivery: jest.fn(),
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
      controllers: [EmailsController],
      providers: [
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
        {
          provide: EmailDeliveryService,
          useValue: mockEmailDeliveryService,
        },
        {
          provide: EmailProviderService,
          useValue: mockEmailProviderService,
        },
        {
          provide: DnsValidationService,
          useValue: mockDnsValidationService,
        },
        {
          provide: EmailReputationService,
          useValue: mockEmailReputationService,
        },
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
    emailsService = module.get<EmailsService>(EmailsService);
    emailDeliveryService = module.get<EmailDeliveryService>(EmailDeliveryService);
    emailProviderService = module.get<EmailProviderService>(EmailProviderService);
    dnsValidationService = module.get<DnsValidationService>(DnsValidationService);
    emailReputationService = module.get<EmailReputationService>(EmailReputationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateEmail', () => {
    const generateData = {
      leadId: 'lead-1',
      context: { length: 'short', purpose: 'introduction' },
    };

    const mockEmailContent = {
      subject: 'AI Generated Subject',
      content: 'AI Generated Content',
    };

    it('should generate AI email content', async () => {
      mockEmailsService.generateEmailContent.mockResolvedValue(mockEmailContent);

      const result = await controller.generateEmail(generateData);

      expect(emailsService.generateEmailContent).toHaveBeenCalledWith(
        generateData.leadId,
        generateData.context,
      );
      expect(result).toEqual(mockEmailContent);
    });

    it('should handle generation errors', async () => {
      const error = new Error('AI generation failed');
      mockEmailsService.generateEmailContent.mockRejectedValue(error);

      await expect(controller.generateEmail(generateData)).rejects.toThrow(error);
    });
  });

  describe('sendEmail', () => {
    const emailData = {
      to: 'recipient@example.com',
      subject: 'Test Email',
      content: 'Test content',
      leadId: 'lead-1',
    };

    const mockSendResponse = {
      success: true,
      messageId: 'message-123',
    };

    it('should send email using company config', async () => {
      mockEmailProviderService.sendEmailWithCompanyConfig.mockResolvedValue(mockSendResponse);

      const result = await controller.sendEmail(emailData, mockRequest);

      expect(emailProviderService.sendEmailWithCompanyConfig).toHaveBeenCalledWith({
        ...emailData,
        companyId: 'company-1',
      });
      expect(result).toEqual(mockSendResponse);
    });

    it('should handle send errors', async () => {
      const error = new Error('Send failed');
      mockEmailProviderService.sendEmailWithCompanyConfig.mockRejectedValue(error);

      await expect(controller.sendEmail(emailData, mockRequest)).rejects.toThrow(error);
    });
  });

  describe('testEmailServices', () => {
    const mockTestResults = {
      sendgrid: { available: true, latency: 150 },
      smtp: { available: true, latency: 200 },
    };

    it('should test email service availability', async () => {
      mockEmailDeliveryService.testEmailServices.mockResolvedValue(mockTestResults);

      const result = await controller.testEmailServices();

      expect(emailDeliveryService.testEmailServices).toHaveBeenCalled();
      expect(result).toEqual(mockTestResults);
    });
  });

  describe('getPreferredProvider', () => {
    it('should get preferred email provider', async () => {
      mockEmailDeliveryService.getPreferredProvider.mockResolvedValue('sendgrid');

      const result = await controller.getPreferredProvider();

      expect(emailDeliveryService.getPreferredProvider).toHaveBeenCalled();
      expect(result).toEqual({ provider: 'sendgrid' });
    });
  });

  describe('configureProvider', () => {
    const configData = {
      provider: 'SMTP',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        username: 'test@gmail.com',
        password: 'password',
      },
    };

    const mockConfigResponse = {
      success: true,
      message: 'Provider configured successfully',
    };

    it('should configure email provider', async () => {
      mockEmailProviderService.configureEmailProvider.mockResolvedValue(mockConfigResponse);

      const result = await controller.configureProvider(configData, mockRequest);

      expect(emailProviderService.configureEmailProvider).toHaveBeenCalledWith({
        ...configData,
        companyId: 'company-1',
      });
      expect(result).toEqual(mockConfigResponse);
    });
  });

  describe('getProviderConfig', () => {
    const mockConfig = {
      provider: 'SMTP',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
      },
    };

    it('should get provider configuration', async () => {
      mockEmailProviderService.getEmailProviderConfig.mockResolvedValue(mockConfig);

      const result = await controller.getProviderConfig(mockRequest);

      expect(emailProviderService.getEmailProviderConfig).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('validateSetup', () => {
    const mockValidation = {
      valid: true,
      issues: [],
    };

    it('should validate email setup', async () => {
      mockEmailProviderService.validateEmailSetup.mockResolvedValue(mockValidation);

      const result = await controller.validateSetup(mockRequest);

      expect(emailProviderService.validateEmailSetup).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockValidation);
    });
  });

  describe('testConfiguration', () => {
    const testData = { email: 'test@example.com' };
    const mockTestResult = {
      success: true,
      messageId: 'test-123',
    };

    it('should test email configuration', async () => {
      mockEmailProviderService.testEmailConfiguration.mockResolvedValue(mockTestResult);

      const result = await controller.testConfiguration(testData, mockRequest);

      expect(emailProviderService.testEmailConfiguration).toHaveBeenCalledWith(
        'company-1',
        'test@example.com',
      );
      expect(result).toEqual(mockTestResult);
    });
  });

  describe('validateDNS', () => {
    const domain = 'example.com';
    const smtpHost = 'smtp.example.com';
    const mockDnsValidation = {
      spf: { valid: true },
      dkim: { valid: true },
      dmarc: { valid: false },
    };

    it('should validate DNS setup', async () => {
      mockDnsValidationService.validateDomainSetup.mockResolvedValue(mockDnsValidation);

      const result = await controller.validateDNS(domain, smtpHost);

      expect(dnsValidationService.validateDomainSetup).toHaveBeenCalledWith(domain, smtpHost);
      expect(result).toEqual(mockDnsValidation);
    });

    it('should validate DNS without SMTP host', async () => {
      mockDnsValidationService.validateDomainSetup.mockResolvedValue(mockDnsValidation);

      await controller.validateDNS(domain);

      expect(dnsValidationService.validateDomainSetup).toHaveBeenCalledWith(domain, undefined);
    });
  });

  describe('generateDKIM', () => {
    const mockDkimKeys = {
      privateKey: 'private-key-content',
      publicKey: 'public-key-content',
      selector: 'default',
    };

    it('should generate DKIM key pair', async () => {
      mockEmailProviderService.generateDKIMKeyPair.mockResolvedValue(mockDkimKeys);

      const result = await controller.generateDKIM(mockRequest);

      expect(emailProviderService.generateDKIMKeyPair).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockDkimKeys);
    });
  });

  describe('getDeliveryStats', () => {
    const mockStats = {
      totalSent: 1000,
      delivered: 950,
      bounced: 30,
      complaints: 5,
    };

    it('should get delivery stats with default period', async () => {
      mockEmailProviderService.getDeliveryStats.mockResolvedValue(mockStats);

      const result = await controller.getDeliveryStats(mockRequest);

      expect(emailProviderService.getDeliveryStats).toHaveBeenCalledWith('company-1', 30);
      expect(result).toEqual(mockStats);
    });

    it('should get delivery stats with custom period', async () => {
      mockEmailProviderService.getDeliveryStats.mockResolvedValue(mockStats);

      const result = await controller.getDeliveryStats(mockRequest, '7');

      expect(emailProviderService.getDeliveryStats).toHaveBeenCalledWith('company-1', 7);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getTemplates', () => {
    const mockTemplates = [
      { id: 'template-1', name: 'Welcome Email' },
      { id: 'template-2', name: 'Follow-up Email' },
    ];

    it('should get email templates', async () => {
      mockEmailsService.getEmailTemplates.mockResolvedValue(mockTemplates);

      const result = await controller.getTemplates(mockRequest);

      expect(emailsService.getEmailTemplates).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockTemplates);
    });
  });

  describe('createTemplate', () => {
    const templateData = {
      name: 'New Template',
      subject: 'New Subject',
      content: 'New Content',
    };

    const mockTemplate = {
      id: 'template-1',
      ...templateData,
      companyId: 'company-1',
    };

    it('should create email template', async () => {
      mockEmailsService.createEmailTemplate.mockResolvedValue(mockTemplate);

      const result = await controller.createTemplate(mockRequest, templateData);

      expect(emailsService.createEmailTemplate).toHaveBeenCalledWith('company-1', templateData);
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('getReputationMetrics', () => {
    const mockMetrics = {
      deliveryRate: 95.5,
      bounceRate: 2.1,
      complaintRate: 0.1,
      reputationScore: 92,
    };

    it('should get reputation metrics', async () => {
      mockEmailReputationService.getCompanyReputationMetrics.mockResolvedValue(mockMetrics);

      const result = await controller.getReputationMetrics(mockRequest);

      expect(emailReputationService.getCompanyReputationMetrics).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockMetrics);
    });
  });

  describe('getDeliveryOptimization', () => {
    const mockOptimization = {
      recommendations: ['Improve subject lines', 'Reduce send frequency'],
      warnings: ['High bounce rate detected'],
    };

    it('should get delivery optimization', async () => {
      mockEmailReputationService.analyzeDeliveryOptimization.mockResolvedValue(mockOptimization);

      const result = await controller.getDeliveryOptimization(mockRequest);

      expect(emailReputationService.analyzeDeliveryOptimization).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockOptimization);
    });
  });

  describe('checkBlacklistStatus', () => {
    const domain = 'example.com';
    const mockBlacklistStatus = {
      isBlacklisted: false,
      sources: [],
      lastChecked: new Date().toISOString(),
    };

    it('should check blacklist status', async () => {
      mockEmailReputationService.monitorBlacklistStatus.mockResolvedValue(mockBlacklistStatus);

      const result = await controller.checkBlacklistStatus(domain);

      expect(emailReputationService.monitorBlacklistStatus).toHaveBeenCalledWith(domain);
      expect(result).toEqual(mockBlacklistStatus);
    });
  });

  describe('trackDeliveryEvent', () => {
    const eventData = {
      emailId: 'email-123',
      eventType: 'delivered',
      timestamp: new Date().toISOString(),
    };

    const mockTrackResponse = {
      success: true,
      eventId: 'event-456',
    };

    it('should track delivery event', async () => {
      mockEmailReputationService.trackEmailDelivery.mockResolvedValue(mockTrackResponse);

      const result = await controller.trackDeliveryEvent(eventData, mockRequest);

      expect(emailReputationService.trackEmailDelivery).toHaveBeenCalledWith({
        ...eventData,
        companyId: 'company-1',
      });
      expect(result).toEqual(mockTrackResponse);
    });
  });
});