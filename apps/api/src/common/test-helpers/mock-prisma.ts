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

// Mock Prisma client for testing
export const createMockPrismaClient = () => {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    emailSettings: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    sendGridConfig: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    smtpConfig: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    email: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
    emailEvent: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    dnsRecord: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    emailDeliveryLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
};

// Type for the mock client
export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;
