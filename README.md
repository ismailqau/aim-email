# AI Email Marketing System

A comprehensive email marketing automation platform powered by artificial intelligence.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and **npm 9+**
- **PostgreSQL** (version 12 or higher)
- **Redis** (version 6 or higher)
- **Git**

### Required API Keys

You'll need to obtain the following API keys:

1. **SendGrid API Key** - For email delivery
   - Sign up at [SendGrid](https://sendgrid.com)
   - Create an API key with "Full Access" permissions

2. **Google Gemini API Key** - For AI content generation
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd email
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/email_marketing_system"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# SendGrid Configuration (REQUIRED)
SENDGRID_API_KEY="SG.your-actual-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="AI Email Marketing System"

# Gemini AI Configuration (REQUIRED)
GEMINI_API_KEY="your-actual-gemini-api-key"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Application Configuration
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Next.js Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

#### 4. Set Up PostgreSQL Database

**Option A: Using Docker (Recommended)**

```bash
# Start PostgreSQL and Redis with Docker Compose
docker-compose up -d postgres redis
```

**Option B: Local Installation**

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE email_marketing_system;
   ```
3. Update the `DATABASE_URL` in your `.env` file

#### 5. Set Up Redis

**Option A: Using Docker (Already included in step 4)**

**Option B: Local Installation**

1. Install Redis locally
2. Start Redis server:
   ```bash
   redis-server
   ```

#### 6. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

#### 7. Start the Development Servers

```bash
# Start both API and Web applications
npm run dev
```

This will start:
- **Backend API**: http://localhost:3001
- **Frontend Web**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api/docs

### 🔧 Alternative: Full Docker Setup

For a complete containerized setup:

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your API keys (SendGrid and Gemini)
# Then start all services
docker-compose up -d

# Run database migrations
docker-compose exec api npm run db:migrate

# Seed the database
docker-compose exec api npm run db:seed
```

## 🧪 Testing the Application

### 1. Access the Application

- Open http://localhost:3000 in your browser
- You should see the landing page

### 2. Create an Account

- Click "Create Account" or go to http://localhost:3000/register
- Fill in your details and register

### 3. Login and Explore

- Login with your credentials
- You'll be redirected to the dashboard
- Explore the features:
  - View analytics metrics
  - Upload leads (CSV)
  - Create email campaigns
  - Build automation pipelines

### 4. Test API Endpoints

- Visit http://localhost:3001/api/docs for Swagger documentation
- Test endpoints directly from the docs

## 📊 Verification Checklist

✅ **Database Connection**
```bash
npm run db:studio
# Should open Prisma Studio at http://localhost:5555
```

✅ **API Health Check**
```bash
curl http://localhost:3001/api/v1/auth/me
# Should return 401 (unauthorized) if not logged in
```

✅ **Redis Connection**
```bash
redis-cli ping
# Should return PONG
```

✅ **Frontend Build**
```bash
npm run build
# Should build successfully without errors
```

## 🛠️ Development Commands

### Project Management
```bash
npm run dev          # Start development servers
npm run build        # Build all applications
npm run start        # Start production servers
npm run test         # Run all tests
npm run lint         # Lint all code
npm run type-check   # TypeScript type checking
```

### Database Operations
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Individual Apps
```bash
# API only
npm run dev --filter=api
npm run build --filter=api

# Web only
npm run dev --filter=web
npm run build --filter=web
```

## 🔐 Environment Variables Reference

### Required Variables
| Variable | Description | Example |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/email_marketing_system` |
| `SENDGRID_API_KEY` | SendGrid API key for emails | `SG.xxxxxxxxxxxxxxxxx` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSyxxxxxxxxxxxxxxxxx` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🏗️ Architecture Overview

This is a monorepo built with Turborepo containing:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: NestJS with PostgreSQL and Prisma ORM
- **Shared Packages**: UI components, database utilities, and TypeScript types
- **Background Processing**: BullMQ with Redis for email automation
- **AI Integration**: Gemini API for email content generation
- **Email Service**: SendGrid for reliable email delivery

## 📁 Project Structure

```
├── apps/
│   ├── web/              # Next.js Frontend Application
│   └── api/              # NestJS Backend API
├── packages/
│   ├── ui/               # Shared React UI Components
│   ├── config/           # Shared Configurations
│   ├── db/               # Prisma Schema and Database Utilities
│   └── types/            # Shared TypeScript Types
├── tools/
│   └── scripts/          # Build and deployment scripts
└── package.json
```

## 🚨 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify database exists
psql -h localhost -U postgres -l
```

**2. Redis Connection Failed**
```bash
# Check Redis is running
redis-cli ping

# Start Redis if not running
redis-server
```

**3. API Keys Not Working**
- Verify SendGrid API key has correct permissions
- Check Gemini API key is active and has quota
- Ensure `.env` file is in the root directory

**4. Build Errors**
```bash
# Clear caches and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

**5. Port Already in Use**
```bash
# Find and kill process using port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Getting Help

1. Check the logs in the terminal where you ran `npm run dev`
2. Verify all environment variables are set correctly
3. Ensure all required services (PostgreSQL, Redis) are running
4. Check the API documentation at http://localhost:3001/api/docs

## 🎯 Key Features

- **User Authentication**: Secure JWT-based authentication
- **Lead Management**: CSV import, search, filtering, and bulk operations
- **AI Email Generation**: Personalized content using Gemini AI
- **Email Automation**: Multi-step pipelines with conditional logic
- **Real-time Analytics**: Performance tracking and detailed reporting
- **Scalable Architecture**: Microservices with shared packages
- **Production Ready**: Docker containers, CI/CD, and monitoring

## 📚 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **NestJS** - Node.js framework with decorators
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **BullMQ** - Background job processing
- **Redis** - Caching and queues

### External Services
- **SendGrid** - Email delivery service
- **Gemini API** - AI content generation
- **Google Cloud** - Cloud infrastructure (for production)

## 📄 License

### MIT License

Copyright (c) 2024 Muhammad Ismail (quaid@live.com)  
Founder: AimNovo.com | AimNexus.ai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Commercial Use Guidelines

This software is available for **commercial use** under the MIT License. When using this software commercially, please:

1. **Maintain Attribution**: Keep the copyright notice and license text in your project
2. **Credit the Author**: Include attribution to Muhammad Ismail and references to AimNovo.com and AimNexus.ai
3. **Share Improvements**: While not required, consider contributing improvements back to the community

### Contact Information

- **Author**: Muhammad Ismail
- **Email**: quaid@live.com
- **Website**: [AimNovo.com](https://aimnovo.com)
- **AI Platform**: [AimNexus.ai](https://aimnexus.ai)

For commercial licensing inquiries, custom development, or enterprise support, please contact: quaid@live.com

---

For questions or support, please contact the development team.