/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: quaid@live.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

// Re-export Prisma types
export type {
  User,
  Company,
  Lead,
  Pipeline,
  PipelineStep,
  EmailTemplate,
  Email,
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
