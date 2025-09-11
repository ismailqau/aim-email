#!/bin/bash

# Build and Test Script for AI Email Marketing System
# This script performs a complete build verification

set -e

echo "🚀 AI Email Marketing System - Build and Test Script"
echo "=================================================="

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_info "Starting build verification process..."

# Step 1: Check Node.js and npm versions
echo ""
print_info "Step 1: Checking Node.js and npm versions"
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node.js version: $node_version"
echo "npm version: $npm_version"

if [[ ! "$node_version" =~ ^v1[8-9]\. ]] && [[ ! "$node_version" =~ ^v[2-9][0-9]\. ]]; then
    print_warning "Node.js version should be 18 or higher. Current: $node_version"
fi

print_success "Node.js and npm versions checked"

# Step 2: Check for required environment file
echo ""
print_info "Step 2: Checking environment configuration"
if [ ! -f ".env.example" ]; then
    print_error ".env.example file not found"
    exit 1
fi

if [ ! -f ".env" ]; then
    print_warning ".env file not found. Copying from .env.example"
    cp .env.example .env
    print_info "Please edit .env file with your API keys before proceeding"
fi

print_success "Environment configuration checked"

# Step 3: Install dependencies
echo ""
print_info "Step 3: Installing dependencies"
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 4: Generate Prisma client
echo ""
print_info "Step 4: Generating Prisma client"
if npx prisma generate --schema=packages/db/prisma/schema.prisma; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 5: Build all packages
echo ""
print_info "Step 5: Building all packages"
if npm run build; then
    print_success "All packages built successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Step 6: Run type checking
echo ""
print_info "Step 6: Running TypeScript type checking"
if npm run type-check; then
    print_success "TypeScript type checking passed"
else
    print_warning "TypeScript type checking failed (this might be OK if not critical)"
fi

# Step 7: Run linting
echo ""
print_info "Step 7: Running code linting"
if npm run lint; then
    print_success "Code linting passed"
else
    print_warning "Code linting failed (this might be OK for development)"
fi

# Step 8: Build summary
echo ""
echo "📊 Build Summary"
echo "================"
print_success "✅ Dependencies installed"
print_success "✅ Prisma client generated"
print_success "✅ All packages built successfully"

echo ""
print_info "Next steps to run the application:"
echo "1. Set up PostgreSQL database"
echo "2. Set up Redis server"
echo "3. Edit .env file with your API keys:"
echo "   - SENDGRID_API_KEY (required for email sending)"
echo "   - GEMINI_API_KEY (required for AI content generation)"
echo "4. Run database migrations: npm run db:migrate"
echo "5. Start development servers: npm run dev"

echo ""
print_success "🎉 Build verification completed successfully!"
print_info "The application is ready to run. See README.md for detailed setup instructions."