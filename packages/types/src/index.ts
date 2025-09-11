// Export all shared types
export * from './api';
export * from './auth';
export * from './lead';
export * from './pipeline';
export * from './email';
export * from './analytics';

// Re-export Prisma types for convenience
export type {
  User,
  Company,
  Lead,
  Pipeline,
  PipelineStep,
  Email,
  EmailTemplate,
  EmailEvent,
  PipelineExecution,
  StepExecution,
  LeadActivity,
  LeadStatus,
  EmailStatus,
  EmailEventType,
  StepType,
  PipelineExecutionStatus,
  StepExecutionStatus,
  ActivityType,
} from '@prisma/client';