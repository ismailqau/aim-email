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

// Email types
export interface EmailGenerationRequest {
  leadId: string;
  templateId?: string;
  context?: Record<string, any>;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailPreview {
  subject: string;
  content: string;
  variables: Record<string, string>;
}