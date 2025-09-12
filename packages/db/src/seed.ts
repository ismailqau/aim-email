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

import { prisma } from './client';
import { hashPassword } from './utils';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const hashedPassword = await hashPassword('password123');
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('👤 Created demo user:', user.email);

  // Create demo company
  const company = await prisma.company.upsert({
    where: { id: 'demo-company-id' },
    update: {},
    create: {
      id: 'demo-company-id',
      userId: user.id,
      name: 'Demo Company',
      description: 'A demo company for testing the email marketing system',
      website: 'https://demo-company.com',
      industry: 'Technology',
      profileData: {
        companySize: '50-100',
        headquarters: 'San Francisco, CA',
        founded: '2020',
      },
    },
  });

  console.log('🏢 Created demo company:', company.name);

  // Create demo email template
  const emailTemplate = await prisma.emailTemplate.create({
    data: {
      companyId: company.id,
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}!',
      content: `
        Hi {{first_name}},

        Welcome to {{company_name}}! We're excited to have you on board.

        Here's what you can expect:
        - Personalized email campaigns
        - Advanced analytics and reporting
        - 24/7 customer support

        If you have any questions, feel free to reach out.

        Best regards,
        The {{company_name}} Team
      `,
      variables: {
        first_name: 'Lead first name',
        company_name: 'Company name',
      },
      aiGenerated: false,
    },
  });

  console.log('📧 Created demo email template:', emailTemplate.name);

  // Create demo pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      companyId: company.id,
      name: 'Welcome Sequence',
      description: 'A welcome email sequence for new leads',
      steps: [
        {
          id: 'step-1',
          type: 'EMAIL',
          templateId: emailTemplate.id,
          delay: 0,
          conditions: {},
        },
        {
          id: 'step-2',
          type: 'DELAY',
          delay: 24, // 24 hours
        },
        {
          id: 'step-3',
          type: 'EMAIL',
          templateId: emailTemplate.id,
          delay: 0,
          conditions: {
            previousEmailOpened: true,
          },
        },
      ],
      isActive: true,
    },
  });

  console.log('🔄 Created demo pipeline:', pipeline.name);

  // Create pipeline steps
  await prisma.pipelineStep.createMany({
    data: [
      {
        pipelineId: pipeline.id,
        templateId: emailTemplate.id,
        order: 1,
        delayHours: 0,
        stepType: 'EMAIL',
        conditions: {},
      },
      {
        pipelineId: pipeline.id,
        order: 2,
        delayHours: 24,
        stepType: 'DELAY',
        conditions: {},
      },
      {
        pipelineId: pipeline.id,
        templateId: emailTemplate.id,
        order: 3,
        delayHours: 0,
        stepType: 'EMAIL',
        conditions: {
          previousEmailOpened: true,
        },
      },
    ],
  });

  // Create demo leads
  const leads = await prisma.lead.createMany({
    data: [
      {
        companyId: company.id,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        companyName: 'Example Corp',
        priorityScore: 85.5,
        status: 'ACTIVE',
        customFields: {
          source: 'Website',
          industry: 'Technology',
        },
      },
      {
        companyId: company.id,
        email: 'jane.smith@test.com',
        firstName: 'Jane',
        lastName: 'Smith',
        title: 'Marketing Director',
        companyName: 'Test Inc',
        priorityScore: 92.0,
        status: 'ACTIVE',
        customFields: {
          source: 'LinkedIn',
          industry: 'Marketing',
        },
      },
      {
        companyId: company.id,
        email: 'bob.wilson@demo.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        title: 'CTO',
        companyName: 'Demo Solutions',
        priorityScore: 78.3,
        status: 'ACTIVE',
        customFields: {
          source: 'Conference',
          industry: 'Software',
        },
      },
    ],
  });

  console.log('👥 Created demo leads:', leads.count);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });