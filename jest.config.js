module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(ts|tsx)',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.next/**',
  ],
  moduleNameMapping: {
    '^@email-system/(.*)$': '<rootDir>/packages/$1/src',
    '^@/(.*)$': '<rootDir>/apps/web/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
};