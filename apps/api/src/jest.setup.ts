/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.GEMINI_API_KEY = 'test-gemini-api-key';
process.env.SENDGRID_API_KEY = 'test-sendgrid-api-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@example.com';
process.env.SMTP_PASS = 'test-password';

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Only suppress specific error messages that are expected in tests
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('GEMINI_API_KEY is not configured')
  ) {
    return;
  }
  originalConsoleError(...args);
};
