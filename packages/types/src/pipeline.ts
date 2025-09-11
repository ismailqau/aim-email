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