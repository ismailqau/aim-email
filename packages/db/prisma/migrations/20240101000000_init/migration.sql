-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('ACTIVE', 'PAUSED', 'UNSUBSCRIBED', 'BOUNCED', 'REPLIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'SPAM_REPORT', 'UNSUBSCRIBE', 'DROPPED', 'DEFERRED', 'PROCESSED');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('EMAIL', 'DELAY', 'CONDITION', 'ACTION');

-- CreateEnum
CREATE TYPE "PipelineExecutionStatus" AS ENUM ('RUNNING', 'COMPLETED', 'PAUSED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StepExecutionStatus" AS ENUM ('PENDING', 'SCHEDULED', 'EXECUTED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EMAIL_SENT', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'EMAIL_REPLIED', 'EMAIL_BOUNCED', 'PIPELINE_STARTED', 'PIPELINE_COMPLETED', 'LEAD_IMPORTED', 'LEAD_UPDATED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "profile_data" JSONB,
    "website" TEXT,
    "industry" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "title" TEXT,
    "company_name" TEXT,
    "custom_fields" JSONB,
    "priority_score" DOUBLE PRECISION,
    "status" "LeadStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_steps" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "template_id" TEXT,
    "order" INTEGER NOT NULL,
    "delay_hours" INTEGER NOT NULL,
    "conditions" JSONB,
    "step_type" "StepType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipeline_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" JSONB,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "template_id" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'DRAFT',
    "sent_at" TIMESTAMP(3),
    "sendgrid_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "event_type" "EmailEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_data" JSONB,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_executions" (
    "id" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "status" "PipelineExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipeline_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_executions" (
    "id" TEXT NOT NULL,
    "pipeline_execution_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "status" "StepExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3),
    "executed_at" TIMESTAMP(3),
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "step_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_company_id_email_key" ON "leads"("company_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "pipeline_executions_pipeline_id_lead_id_key" ON "pipeline_executions"("pipeline_id", "lead_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_steps" ADD CONSTRAINT "pipeline_steps_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_steps" ADD CONSTRAINT "pipeline_steps_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_executions" ADD CONSTRAINT "pipeline_executions_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_executions" ADD CONSTRAINT "pipeline_executions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_executions" ADD CONSTRAINT "step_executions_pipeline_execution_id_fkey" FOREIGN KEY ("pipeline_execution_id") REFERENCES "pipeline_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_executions" ADD CONSTRAINT "step_executions_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "pipeline_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;