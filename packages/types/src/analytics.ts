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

// Analytics types
export interface DashboardMetrics {
  totalLeads: number;
  activeLeads: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface PerformanceData {
  period: string;
  emailsSent: number;
  opens: number;
  clicks: number;
  replies: number;
  conversions: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
}

export interface PipelineMetrics {
  id: string;
  name: string;
  totalExecutions: number;
  activeExecutions: number;
  completedExecutions: number;
  averageCompletionTime: number;
  conversionRate: number;
}
