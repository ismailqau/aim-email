<!--
AI Email Marketing System
Copyright (c) 2024 Muhammad Ismail
Email: ismail@aimnovo.com
Founder: AimNovo.com | AimNexus.ai

Licensed under the MIT License.
See LICENSE file in the project root for full license information.

For commercial use, please maintain proper attribution.
-->

# Contributing to AI Email Marketing System

Thank you for your interest in contributing to the AI Email Marketing System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Quality Standards](#code-quality-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or personal characteristics.

### Expected Behavior

- **Be respectful** and professional in all interactions
- **Be collaborative** and open to feedback
- **Be patient** with new contributors
- **Focus on constructive** criticism and solutions
- **Respect different** perspectives and approaches

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Spam or inappropriate content
- Sharing private information without consent

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js 18+** and **npm 9+**
- **PostgreSQL 12+**
- **Redis 6+**
- **Git**

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/your-username/ai-email-marketing-system.git
   cd ai-email-marketing-system
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/original-owner/ai-email-marketing-system.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Set up environment** (copy and edit `.env` file):

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Initialize database**:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

7. **Verify setup**:
   ```bash
   npm run validate  # Should pass all checks
   npm run test      # Should pass all tests
   npm run dev       # Should start development servers
   ```

## 🔄 Development Workflow

### Creating a Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main
git push origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** following code standards
2. **Test your changes**:

   ```bash
   npm run validate     # Check code quality
   npm run test         # Run tests
   ```

3. **Commit your changes** (pre-commit hooks will run automatically):
   ```bash
   git add .
   git commit -m "feat(scope): add new feature description"
   ```

### Staying Updated

```bash
# Regularly sync with upstream
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main
```

## ✨ Code Quality Standards

### Automated Quality Checks

This project uses **GitHub-native code quality tools** and **pre-commit hooks** that automatically run:

#### CI/CD Quality Pipeline

- **CodeQL**: Security vulnerability and code quality analysis
- **ESLint with SARIF**: Advanced linting with GitHub Security tab integration
- **Dependency Audit**: NPM vulnerability scanning
- **TypeScript Strict Checks**: Enhanced type safety validation

#### Local Development Hooks

- **ESLint**: Code linting and quality checks
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **License Headers**: Copyright notice validation

#### Comprehensive Code Analysis

- **Plato**: Complexity analysis and maintainability metrics
- **Madge**: Circular dependency detection
- **ts-complexity**: TypeScript-specific complexity metrics
- **Bundle Analysis**: Build output optimization insights

### Code Style Guidelines

#### TypeScript Standards

```typescript
// ✅ Good: Use proper types
interface UserData {
  id: string;
  email: string;
  name: string;
}

const createUser = (userData: UserData): Promise<User> => {
  // Implementation
};

// ❌ Bad: Avoid any types
const createUser = (userData: any): any => {
  // Implementation
};
```

#### Naming Conventions

```typescript
// ✅ Good naming
const emailService = new EmailService();
const MAX_RETRY_ATTEMPTS = 3;
const isUserAuthenticated = true;

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
}

// ❌ Bad naming
const es = new EmailService();
const max = 3;
const flag = true;
```

#### File Organization

```
apps/api/src/
├── auth/                 # Feature modules
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│       └── auth.dto.ts
├── common/               # Shared utilities
│   ├── config/
│   ├── database/
│   └── test-helpers/
└── main.ts
```

### Documentation Standards

#### JSDoc Comments

```typescript
/**
 * Sends an email using the configured email provider
 * @param recipient - Email recipient address
 * @param subject - Email subject line
 * @param content - Email body content
 * @returns Promise resolving to email delivery status
 * @throws {EmailDeliveryError} When email delivery fails
 */
async sendEmail(
  recipient: string,
  subject: string,
  content: string
): Promise<EmailDeliveryStatus> {
  // Implementation
}
```

#### README Updates

When adding features, update relevant documentation:

- API endpoint documentation
- Configuration options
- Environment variables
- Usage examples

## 📝 Commit Guidelines

### Conventional Commits Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type       | Description             | Example                                         |
| ---------- | ----------------------- | ----------------------------------------------- |
| `feat`     | New feature             | `feat(auth): add OAuth2 integration`            |
| `fix`      | Bug fix                 | `fix(emails): resolve template rendering issue` |
| `docs`     | Documentation           | `docs: update API documentation`                |
| `style`    | Code formatting         | `style: fix eslint warnings`                    |
| `refactor` | Code restructuring      | `refactor(leads): optimize CSV parsing`         |
| `perf`     | Performance improvement | `perf(db): add database indexes`                |
| `test`     | Testing                 | `test(auth): add unit tests for login`          |
| `chore`    | Maintenance             | `chore: update dependencies`                    |
| `ci`       | CI/CD changes           | `ci: add automated testing workflow`            |

### Scope Guidelines

Use these scopes to indicate the affected area:

| Scope       | Description                    |
| ----------- | ------------------------------ |
| `auth`      | Authentication & authorization |
| `emails`    | Email sending & templates      |
| `leads`     | Lead management                |
| `pipelines` | Email automation               |
| `analytics` | Reporting & metrics            |
| `ui`        | User interface                 |
| `api`       | Backend API                    |
| `db`        | Database changes               |
| `config`    | Configuration                  |

### Commit Message Examples

```bash
# ✅ Good examples
git commit -m "feat(emails): add email template validation"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "test(leads): add integration tests for CSV import"

# ❌ Bad examples
git commit -m "fix stuff"
git commit -m "update"
git commit -m "WIP"
git commit -m "commit"
```

## 🔀 Pull Request Process

### Before Creating a PR

1. **Ensure code quality**:

   ```bash
   npm run validate  # Must pass
   npm run test      # Must pass
   npm run build     # Must pass
   ```

2. **Update documentation** if needed
3. **Test your changes** thoroughly
4. **Rebase on latest main**:
   ```bash
   git rebase upstream/main
   ```

### PR Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots for UI changes.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process

1. **Automated checks** must pass
2. **At least one reviewer** approval required
3. **Address all feedback** before merging
4. **Squash commits** if requested
5. **Merge when approved** and all checks pass

## 🐛 Issue Guidelines

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**

- OS: [e.g. macOS 12.0]
- Node.js: [e.g. 18.17.0]
- npm: [e.g. 9.8.0]
- Browser: [e.g. Chrome 91.0]

**Additional Context**
Screenshots, logs, or other relevant information.
```

### Feature Requests

Use this template for feature requests:

```markdown
**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other solutions you've considered.

**Use Cases**
Specific examples of how this would be used.

**Additional Context**
Any other context or screenshots.
```

## 🧪 Testing Guidelines

### Testing Philosophy

- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test component interactions
- **No E2E Tests**: Project policy excludes end-to-end tests

### Writing Tests

```typescript
// Example unit test
describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  it('should validate email addresses correctly', () => {
    expect(emailService.isValidEmail('test@example.com')).toBe(true);
    expect(emailService.isValidEmail('invalid-email')).toBe(false);
  });
});
```

### Test Requirements

- **All new features** must include tests
- **Bug fixes** should include regression tests
- **Minimum 80% code coverage** for new code
- **Tests must pass** before PR approval

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm run test -- auth.service.spec.ts
```

## 🏷️ Release Guidelines

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Process

1. **Create release branch**:

   ```bash
   git checkout -b release/v1.2.0
   ```

2. **Update version numbers**:

   ```bash
   npm version minor  # or major/patch
   ```

3. **Update CHANGELOG.md**
4. **Create release PR**
5. **Tag release** after merge:
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

## 💬 Communication

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: ismail@aimnovo.com for security issues

### Response Times

- **Critical bugs**: 24-48 hours
- **Feature requests**: 1-2 weeks
- **General questions**: 2-5 days

We appreciate your contributions and look forward to working with you! 🚀
