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