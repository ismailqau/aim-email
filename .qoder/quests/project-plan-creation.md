# AI Email Marketing System - Design Document

## Overview

The AI Email Marketing System is a specialized automation platform that leverages artificial intelligence to generate personalized outreach emails. The system manages leads from CSV imports, automates email sequences through pipelines, tracks engagement metrics, and provides data-driven optimization suggestions while maintaining email deliverability best practices.

### Key Features

- AI-powered personalized email generation using Gemini API
- Automated email pipeline sequences with scheduling
- Lead management and CSV import capabilities
- Real-time engagement tracking and analytics
- Email deliverability optimization
- A/B testing framework
- Company profile management

## Technology Stack & Dependencies

### Monorepo Architecture

```
/
├── apps/
│   ├── web/        # Next.js Frontend Application
│   └── api/        # Node.js Backend API (Express/NestJS)
├── packages/
│   ├── ui/         # Shared React UI Components
│   ├── config/     # Shared Configurations (ESLint, TypeScript)
│   ├── db/         # Prisma Schema and Database Utilities
│   └── types/      # Shared TypeScript Types
├── tools/
│   └── scripts/    # Build and deployment scripts
└── package.json
```

### Core Technologies

- **Frontend**: Next.js with TypeScript (SSR capabilities, routing)
- **Backend**: Node.js with NestJS (modular architecture, decorators)
- **Database**: PostgreSQL with Prisma ORM (type-safe database access)
- **Queue System**: BullMQ with Redis (background job processing)
- **AI Integration**: Gemini API (email content generation)
- **Email Service**: SendGrid (transactional email delivery)
- **Analytics**: Google BigQuery + Looker Studio (data warehousing and visualization)
- **Authentication**: Clerk or NextAuth.js (user management)
- **Deployment**: Google Cloud Platform (Cloud Run, Cloud SQL, Memorystore)

## Architecture

### System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB[Next.js Web App]
        UI[Shared UI Components]
    end

    subgraph "API Layer"
        API[NestJS API Server]
        AUTH[Authentication Service]
        WEBHOOK[SendGrid Webhooks]
    end

    subgraph "Background Processing"
        QUEUE[BullMQ Queue]
        WORKER[Email Worker Process]
        SCHEDULER[Pipeline Scheduler]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        REDIS[(Redis Cache)]
        BQ[(BigQuery)]
    end

    subgraph "External Services"
        GEMINI[Gemini AI API]
        SENDGRID[SendGrid API]
        LOOKER[Looker Studio]
    end

    WEB --> API
    API --> DB
    API --> QUEUE
    API --> GEMINI
    QUEUE --> WORKER
    WORKER --> SENDGRID
    SENDGRID --> WEBHOOK
    WEBHOOK --> API
    DB --> BQ
    BQ --> LOOKER
    API --> REDIS
```

### Component Architecture

#### Frontend Components Hierarchy

```
App Layout
├── Authentication
│   ├── LoginForm
│   ├── SignupForm
│   └── UserProfile
├── Dashboard
│   ├── MetricCards
│   ├── RecentActivity
│   └── QuickActions
├── Lead Management
│   ├── LeadUpload
│   ├── LeadList
│   ├── LeadDetails
│   └── BulkActions
├── Pipeline Builder
│   ├── PipelineCanvas
│   ├── StepEditor
│   ├── ConditionBuilder
│   └── TemplateEditor
├── Email Composer
│   ├── AIAssistant
│   ├── TemplateLibrary
│   ├── PreviewPane
│   └── TestSender
├── Analytics
│   ├── PerformanceDashboard
│   ├── EngagementCharts
│   ├── ConversionFunnels
│   └── ReportBuilder
└── Settings
    ├── CompanyProfile
    ├── EmailSettings
    ├── IntegrationConfig
    └── DeliverabilityHealth
```

### Data Models & Database Schema

```mermaid
erDiagram
    User ||--o{ Company : manages
    Company ||--o{ Lead : contains
    Company ||--o{ Pipeline : owns
    Company ||--o{ EmailTemplate : creates

    Lead ||--o{ LeadActivity : generates
    Lead ||--o{ PipelineExecution : participates_in

    Pipeline ||--o{ PipelineStep : contains
    Pipeline ||--o{ PipelineExecution : executes

    PipelineStep ||--o{ EmailTemplate : uses
    PipelineStep ||--o{ StepExecution : creates

    EmailTemplate ||--o{ Email : generates
    Email ||--o{ EmailEvent : tracks

    User {
        string id PK
        string email
        string name
        datetime created_at
        datetime updated_at
    }

    Company {
        string id PK
        string user_id FK
        string name
        string description
        json profile_data
        string website
        string industry
        datetime created_at
    }

    Lead {
        string id PK
        string company_id FK
        string email
        string first_name
        string last_name
        string title
        string company_name
        json custom_fields
        float priority_score
        enum status
        datetime created_at
    }

    Pipeline {
        string id PK
        string company_id FK
        string name
        string description
        json steps
        boolean is_active
        datetime created_at
    }

    PipelineStep {
        string id PK
        string pipeline_id FK
        string template_id FK
        integer order
        integer delay_hours
        json conditions
        enum step_type
    }

    Email {
        string id PK
        string lead_id FK
        string template_id FK
        string subject
        text content
        enum status
        datetime sent_at
        string sendgrid_message_id
    }

    EmailEvent {
        string id PK
        string email_id FK
        enum event_type
        datetime timestamp
        json event_data
    }
```

### API Endpoints Reference

#### Authentication Endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | User registration   |
| POST   | `/auth/login`    | User authentication |
| POST   | `/auth/logout`   | User logout         |
| GET    | `/auth/me`       | Get current user    |

#### Lead Management Endpoints

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/leads/upload`      | Upload CSV leads           |
| GET    | `/leads`             | List leads with pagination |
| GET    | `/leads/:id`         | Get lead details           |
| PUT    | `/leads/:id`         | Update lead information    |
| DELETE | `/leads/:id`         | Delete lead                |
| POST   | `/leads/bulk-assign` | Assign leads to pipeline   |

#### Pipeline Management Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/pipelines`           | List all pipelines       |
| POST   | `/pipelines`           | Create new pipeline      |
| GET    | `/pipelines/:id`       | Get pipeline details     |
| PUT    | `/pipelines/:id`       | Update pipeline          |
| DELETE | `/pipelines/:id`       | Delete pipeline          |
| POST   | `/pipelines/:id/start` | Start pipeline for leads |

#### Email Generation & Sending Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/emails/generate`  | Generate AI email content |
| POST   | `/emails/send`      | Send individual email     |
| GET    | `/emails/templates` | List email templates      |
| POST   | `/emails/templates` | Create email template     |

#### Analytics Endpoints

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/analytics/dashboard`   | Get dashboard metrics |
| GET    | `/analytics/performance` | Get performance data  |
| POST   | `/analytics/export`      | Export analytics data |

#### Webhook Endpoints

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/webhooks/sendgrid` | Handle SendGrid events |

### Business Logic Layer

#### Lead Processing Architecture

```mermaid
flowchart TD
    A[CSV Upload] --> B[Data Validation]
    B --> C[Duplicate Detection]
    C --> D[Data Enrichment]
    D --> E[Lead Scoring]
    E --> F[Database Storage]
    F --> G[Pipeline Assignment]

    B --> H[Validation Errors]
    C --> I[Duplicate Handling]
    H --> J[Error Reporting]
    I --> J
```

#### Email Generation Workflow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as Backend API
    participant AI as Gemini API
    participant DB as Database
    participant Queue as BullMQ

    UI->>API: Request email generation
    API->>DB: Fetch lead & company data
    DB-->>API: Return profile data
    API->>AI: Generate email content
    AI-->>API: Return email variations
    API->>DB: Save email template
    API-->>UI: Return generated emails

    UI->>API: Approve and schedule
    API->>Queue: Add to email queue
    Queue-->>API: Job queued
    API-->>UI: Confirmation
```

#### Pipeline Execution Engine

```mermaid
stateDiagram-v2
    [*] --> PipelineStart
    PipelineStart --> StepExecution
    StepExecution --> DelayPeriod
    DelayPeriod --> ConditionCheck
    ConditionCheck --> NextStep: Condition Met
    ConditionCheck --> AlternativeStep: Condition Failed
    ConditionCheck --> PipelineComplete: No More Steps
    NextStep --> StepExecution
    AlternativeStep --> StepExecution
    PipelineComplete --> [*]

    StepExecution --> EmailSend
    EmailSend --> DeliveryTracking
    DeliveryTracking --> EngagementTracking
    EngagementTracking --> StepComplete
    StepComplete --> DelayPeriod
```

### Middleware & Background Processing

#### Queue Management Architecture

```mermaid
graph LR
    subgraph "Job Types"
        A[Email Sending Jobs]
        B[Pipeline Execution Jobs]
        C[Analytics Processing Jobs]
        D[Data Sync Jobs]
    end

    subgraph "Queue Processing"
        E[High Priority Queue]
        F[Standard Queue]
        G[Low Priority Queue]
    end

    subgraph "Workers"
        H[Email Worker]
        I[Pipeline Worker]
        J[Analytics Worker]
    end

    A --> E
    B --> F
    C --> G
    D --> G

    E --> H
    F --> I
    G --> J
```

#### Rate Limiting Strategy

| Service           | Limit Type      | Rate     | Implementation         |
| ----------------- | --------------- | -------- | ---------------------- |
| SendGrid API      | Requests/second | 600/sec  | BullMQ rate limiter    |
| Gemini API        | Requests/minute | 60/min   | Redis-based throttling |
| CSV Upload        | File size       | 10MB max | Express middleware     |
| Pipeline Creation | Per user/hour   | 50/hour  | Redis counter          |

### Analytics & Data Pipeline

#### Data Flow Architecture

```mermaid
graph TB
    subgraph "Operational Data"
        A[PostgreSQL Database]
        B[SendGrid Webhooks]
        C[Application Logs]
    end

    subgraph "ETL Pipeline"
        D[Cloud Functions ETL]
        E[Data Transformation]
        F[Data Validation]
    end

    subgraph "Analytics Layer"
        G[BigQuery Data Warehouse]
        H[Looker Studio Dashboards]
        I[Real-time Metrics API]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
```

#### Key Performance Indicators (KPIs)

| Metric Category      | KPI                 | Calculation                           | Source          |
| -------------------- | ------------------- | ------------------------------------- | --------------- |
| Email Performance    | Open Rate           | (Opens / Sent) × 100                  | SendGrid Events |
| Email Performance    | Click Rate          | (Clicks / Sent) × 100                 | SendGrid Events |
| Email Performance    | Reply Rate          | (Replies / Sent) × 100                | SendGrid Events |
| Pipeline Performance | Conversion Rate     | (Conversions / Pipeline Starts) × 100 | Database        |
| Lead Quality         | Engagement Score    | Weighted sum of interactions          | Calculated      |
| System Performance   | Email Delivery Rate | (Delivered / Sent) × 100              | SendGrid Events |

### Testing Strategy

#### Testing Pyramid

```mermaid
graph TB
    subgraph "Testing Levels"
        A[End-to-End Tests<br/>Playwright/Cypress]
        B[Integration Tests<br/>Jest + Supertest]
        C[Unit Tests<br/>Jest + Testing Library]
    end

    subgraph "Test Coverage Areas"
        D[Email Generation Logic]
        E[Pipeline Execution]
        F[Data Processing]
        G[API Endpoints]
        H[UI Components]
        I[Background Jobs]
    end

    C --> D
    C --> E
    C --> F
    B --> G
    B --> I
    A --> H
```

#### Test Data Management

- **Mock Services**: Mock Gemini API and SendGrid for testing
- **Test Database**: Separate PostgreSQL instance with test data
- **Fixture Management**: JSON fixtures for consistent test data
- **Email Testing**: Use SendGrid sandbox mode for integration tests

### Security & Authentication

#### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant API as Backend API
    participant DB as Database

    U->>F: Login Request
    F->>A: Authenticate
    A->>DB: Verify Credentials
    DB-->>A: User Data
    A-->>F: JWT Token
    F->>API: API Request + Token
    API->>A: Validate Token
    A-->>API: User Context
    API-->>F: Response
```

#### Security Measures

- **JWT Token Authentication** with refresh token rotation
- **Role-Based Access Control (RBAC)** for multi-user companies
- **API Rate Limiting** to prevent abuse
- **Input Validation** using Joi/Zod schemas
- **SQL Injection Protection** through Prisma ORM
- **CORS Configuration** for cross-origin requests
- **Environment Variable Management** for sensitive data

### Deployment & Infrastructure

#### Cloud Infrastructure (GCP)

```mermaid
graph TB
    subgraph "Frontend"
        A[Next.js App<br/>Cloud Run]
        B[CDN<br/>Cloud CDN]
    end

    subgraph "Backend Services"
        C[NestJS API<br/>Cloud Run]
        D[Background Workers<br/>Cloud Run Jobs]
    end

    subgraph "Data Storage"
        E[PostgreSQL<br/>Cloud SQL]
        F[Redis<br/>Memorystore]
        G[BigQuery<br/>Data Warehouse]
    end

    subgraph "External Services"
        H[SendGrid<br/>Email Service]
        I[Gemini API<br/>AI Service]
        J[Looker Studio<br/>Analytics]
    end

    A --> C
    C --> E
    C --> F
    D --> F
    E --> G
    C --> H
    C --> I
    G --> J
```

#### Container Strategy

- **Docker Images**: Multi-stage builds for optimized production images
- **Artifact Registry**: Store and version container images
- **Health Checks**: Configure proper health check endpoints
- **Resource Limits**: Set appropriate CPU and memory limits
- **Auto-scaling**: Configure based on CPU/memory usage and queue depth

#### CI/CD Pipeline

```mermaid
graph LR
    A[Git Push] --> B[GitHub Actions]
    B --> C[Run Tests]
    C --> D[Build Images]
    D --> E[Security Scan]
    E --> F[Deploy Staging]
    F --> G[Integration Tests]
    G --> H[Deploy Production]

    C --> I[Test Failed]
    E --> J[Security Issues]
    G --> K[Integration Failed]

    I --> L[Notify Team]
    J --> L
    K --> L
```

### Phase Implementation Strategy

#### Phase 1: Core MVP (Weeks 1-4)

- User authentication and company profile setup
- Basic lead upload and management
- AI email generation (single emails)
- Manual email sending via SendGrid
- Basic email tracking

#### Phase 2: Automation & Pipelines (Weeks 5-8)

- Pipeline builder UI with drag-and-drop interface
- BullMQ job queue setup for background processing
- Automated email scheduling and sending
- Step conditions and branching logic
- Template management system

#### Phase 3: Analytics & Intelligence (Weeks 9-12)

- SendGrid webhook integration for real-time events
- BigQuery data pipeline setup
- Looker Studio dashboard creation
- Lead scoring algorithm implementation
- Performance analytics and reporting

#### Phase 4: Scaling & Optimization (Weeks 13-16)

- Advanced rate limiting and throttling
- Email warm-up scheduling features
- Deliverability health monitoring
- A/B testing framework
- Advanced analytics and AI insights

### Error Handling & Monitoring

#### Error Handling Strategy

- **Global Exception Filters** for consistent error responses
- **Validation Pipes** for request data validation
- **Retry Mechanisms** for external API failures
- **Circuit Breaker Pattern** for resilient service communication
- **Dead Letter Queues** for failed background jobs

#### Monitoring & Observability

- **Application Metrics**: Response times, error rates, throughput
- **Business Metrics**: Email delivery rates, engagement metrics
- **Infrastructure Metrics**: CPU, memory, database performance
- **Log Aggregation**: Structured logging with correlation IDs
- **Alerting**: Automated alerts for critical issues and thresholds
