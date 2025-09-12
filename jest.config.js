module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/apps', '<rootDir>/packages'],
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    '!apps/**/*.d.ts',
    '!packages/**/*.d.ts',
    '!apps/**/node_modules/**',
    '!packages/**/node_modules/**',
    '!apps/**/dist/**',
    '!packages/**/dist/**',
    '!apps/**/.next/**',
    '!apps/**/coverage/**',
    '!packages/**/coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/apps/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/apps/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/packages/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/packages/**/*.{test,spec}.{ts,tsx}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^@api/(.*)$': '<rootDir>/apps/api/src/$1',
    '^@packages/(.*)$': '<rootDir>/packages/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
