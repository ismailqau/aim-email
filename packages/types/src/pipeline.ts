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

// Pipeline types
export interface PipelineStepData {
  id: string;
  type: 'EMAIL' | 'DELAY' | 'CONDITION' | 'ACTION';
  templateId?: string;
  delayHours?: number;
  conditions?: Record<string, any>;
  order: number;
}

export interface PipelineExecutionSummary {
  totalLeads: number;
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  averageCompletionTime: number;
}
