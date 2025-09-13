# Manual GitHub Pages Deployment

This repository supports manual deployment to GitHub Pages with customizable options.

## How to Trigger Manual Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Configure the deployment options:

### Deployment Options

#### Deploy Environment

- **Production** (default): Deploy with production settings
- **Staging**: Deploy with staging/development settings

#### Skip Tests

- **false** (default): Run all tests before deployment
- **true**: Skip tests for faster deployment (use with caution)

#### Force Rebuild

- **false** (default): Use cached dependencies (faster)
- **true**: Clean install all dependencies (slower but ensures fresh build)

## When to Use Manual Deployment

- **Emergency fixes**: Deploy critical fixes immediately without waiting for CI
- **Testing deployments**: Test deployment process with different configurations
- **Staging deployments**: Deploy to staging environment for testing
- **Force clean builds**: When you suspect dependency issues

## Automatic Deployment

The workflow also runs automatically on:

- Push to `main` branch
- Completion of Test Coverage Report workflow

## Security Notes

- Manual deployments are logged with the triggering user's information
- All deployment options are displayed in the workflow logs for transparency
- Tests can be skipped but this should be used carefully in production
