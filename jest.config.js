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
  moduleNameMapper: {
    '^@email-system/db$': '<rootDir>/apps/api/src/__mocks__/@email-system/db.ts',
    '^@email-system/(.*)$': '<rootDir>/packages/$1/src/index.ts',
    '^@/(.*)$': '<rootDir>/apps/web/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/packages/.*/dist/'],
  testTimeout: 10000,
};;;