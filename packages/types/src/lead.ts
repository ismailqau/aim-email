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

// Lead management types
export interface LeadImportData {
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  companyName?: string;
  customFields?: Record<string, any>;
}

export interface LeadFilterOptions {
  status?: string[];
  priorityRange?: [number, number];
  dateRange?: [string, string];
  source?: string[];
}

export interface LeadBulkAction {
  action: 'assign_pipeline' | 'update_status' | 'delete' | 'export';
  leadIds: string[];
  data?: any;
}