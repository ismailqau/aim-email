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