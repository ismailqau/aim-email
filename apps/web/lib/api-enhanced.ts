/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

import { apiService, PaginatedResponse } from './api-service';
import type { User, Company, Lead, Pipeline } from '@email-system/types';

// Enhanced Auth API
export const authApiEnhanced = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }): Promise<{ user: User; token: string }> => {
    return apiService.post('/auth/register', userData);
  },

  login: async (credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<{ user: User; token: string; refreshToken?: string }> => {
    return apiService.post('/auth/login', credentials);
  },

  logout: async (): Promise<{ message: string }> => {
    return apiService.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    return apiService.post('/auth/refresh', { refreshToken });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiService.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    return apiService.post('/auth/reset-password', data);
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return apiService.post('/auth/verify-email', { token });
  },
};

// Enhanced Users API
export const usersApiEnhanced = {
  getProfile: async (): Promise<User> => {
    return apiService.get('/users/me');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiService.put('/users/me', data);
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return apiService.put('/users/me/password', data);
  },

  uploadAvatar: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ avatarUrl: string }> => {
    return apiService.uploadFile('/users/me/avatar', file, onProgress);
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    return apiService.delete('/users/me');
  },
};

// Enhanced Companies API
export const companiesApiEnhanced = {
  getCompanies: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<PaginatedResponse<Company>> => {
    return apiService.getPaginated('/companies', params);
  },

  getCompany: async (id: string): Promise<Company> => {
    return apiService.get(`/companies/${id}`);
  },

  createCompany: async (
    data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Company> => {
    return apiService.post('/companies', data);
  },

  updateCompany: async (
    id: string,
    data: Partial<Company>
  ): Promise<Company> => {
    return apiService.put(`/companies/${id}`, data);
  },

  deleteCompany: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`/companies/${id}`);
  },

  searchCompanies: async (query: string): Promise<Company[]> => {
    return apiService.get('/companies/search', { q: query });
  },

  getCompanyInsights: async (
    id: string
  ): Promise<{
    totalLeads: number;
    activeLeads: number;
    conversionRate: number;
    lastActivity: string;
  }> => {
    return apiService.get(`/companies/${id}/insights`);
  },
};

// Enhanced Leads API
export const leadsApiEnhanced = {
  getLeads: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    companyId?: string;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Lead>> => {
    return apiService.getPaginated('/leads', params);
  },

  getLead: async (id: string): Promise<Lead> => {
    return apiService.get(`/leads/${id}`);
  },

  createLead: async (
    data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Lead> => {
    return apiService.post('/leads', data);
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    return apiService.put(`/leads/${id}`, data);
  },

  deleteLead: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`/leads/${id}`);
  },

  bulkDeleteLeads: async (ids: string[]): Promise<{ deletedCount: number }> => {
    return apiService.post('/leads/bulk-delete', { ids });
  },

  uploadLeads: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{
    imported: number;
    failed: number;
    errors?: Array<{ row: number; error: string }>;
  }> => {
    return apiService.uploadFile('/leads/upload', file, onProgress);
  },

  exportLeads: async (params?: {
    format?: 'csv' | 'xlsx';
    filters?: any;
  }): Promise<{ downloadUrl: string }> => {
    return apiService.post('/leads/export', params);
  },

  addTags: async (leadId: string, tags: string[]): Promise<Lead> => {
    return apiService.post(`/leads/${leadId}/tags`, { tags });
  },

  removeTags: async (leadId: string, tags: string[]): Promise<Lead> => {
    return apiService.post(`/leads/${leadId}/tags/remove`, { tags });
  },

  getLeadActivity: async (
    leadId: string
  ): Promise<
    Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
      metadata?: any;
    }>
  > => {
    return apiService.get(`/leads/${leadId}/activity`);
  },
};

// Enhanced Pipelines API
export const pipelinesApiEnhanced = {
  getPipelines: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Pipeline>> => {
    return apiService.getPaginated('/pipelines', params);
  },

  getPipeline: async (id: string): Promise<Pipeline> => {
    return apiService.get(`/pipelines/${id}`);
  },

  createPipeline: async (
    data: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Pipeline> => {
    return apiService.post('/pipelines', data);
  },

  updatePipeline: async (
    id: string,
    data: Partial<Pipeline>
  ): Promise<Pipeline> => {
    return apiService.put(`/pipelines/${id}`, data);
  },

  deletePipeline: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`/pipelines/${id}`);
  },

  startPipeline: async (
    id: string,
    config: {
      leadIds: string[];
      scheduleAt?: string;
      variables?: Record<string, any>;
    }
  ): Promise<{ executionId: string; message: string }> => {
    return apiService.post(`/pipelines/${id}/start`, config);
  },

  stopPipeline: async (
    id: string,
    executionId: string
  ): Promise<{ message: string }> => {
    return apiService.post(`/pipelines/${id}/stop`, { executionId });
  },

  getPipelineStats: async (
    id: string
  ): Promise<{
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    lastExecution?: string;
  }> => {
    return apiService.get(`/pipelines/${id}/stats`);
  },

  clonePipeline: async (id: string, name: string): Promise<Pipeline> => {
    return apiService.post(`/pipelines/${id}/clone`, { name });
  },
};

// Enhanced Emails API
export const emailsApiEnhanced = {
  generateEmail: async (data: {
    leadId: string;
    templateId?: string;
    context?: Record<string, any>;
    tone?: 'professional' | 'casual' | 'friendly';
    length?: 'short' | 'medium' | 'long';
  }): Promise<{
    subject: string;
    content: string;
    previewText: string;
  }> => {
    return apiService.post('/emails/generate', data);
  },

  sendEmail: async (data: {
    leadId: string;
    subject: string;
    content: string;
    scheduleAt?: string;
    trackOpens?: boolean;
    trackClicks?: boolean;
  }): Promise<{
    messageId: string;
    status: string;
    scheduledFor?: string;
  }> => {
    return apiService.post('/emails/send', data);
  },

  getTemplates: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<
    PaginatedResponse<{
      id: string;
      name: string;
      subject: string;
      content: string;
      category: string;
      variables: string[];
      createdAt: string;
    }>
  > => {
    return apiService.getPaginated('/emails/templates', params);
  },

  createTemplate: async (data: {
    name: string;
    subject: string;
    content: string;
    category?: string;
    variables?: string[];
  }): Promise<{ id: string; message: string }> => {
    return apiService.post('/emails/templates', data);
  },

  updateTemplate: async (
    id: string,
    data: {
      name?: string;
      subject?: string;
      content?: string;
      category?: string;
      variables?: string[];
    }
  ): Promise<{ message: string }> => {
    return apiService.put(`/emails/templates/${id}`, data);
  },

  deleteTemplate: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`/emails/templates/${id}`);
  },

  getEmailHistory: async (params?: {
    page?: number;
    limit?: number;
    leadId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<
    PaginatedResponse<{
      id: string;
      leadId: string;
      subject: string;
      status: string;
      sentAt: string;
      openedAt?: string;
      clickedAt?: string;
    }>
  > => {
    return apiService.getPaginated('/emails/history', params);
  },
};

// Enhanced Analytics API
export const analyticsApiEnhanced = {
  getDashboard: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    timezone?: string;
  }): Promise<{
    totalLeads: number;
    activeLeads: number;
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    conversionRate: number;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  }> => {
    return apiService.get('/analytics/dashboard', params);
  },

  getPerformance: async (params?: {
    startDate?: string;
    endDate?: string;
    granularity?: 'hour' | 'day' | 'week' | 'month';
    metrics?: string[];
  }): Promise<{
    metrics: Record<
      string,
      Array<{
        timestamp: string;
        value: number;
      }>
    >;
    summary: Record<
      string,
      {
        current: number;
        previous: number;
        change: number;
        changePercent: number;
      }
    >;
  }> => {
    return apiService.get('/analytics/performance', params);
  },

  getLeadInsights: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    segmentBy?: 'company' | 'industry' | 'source';
  }): Promise<{
    segments: Array<{
      name: string;
      count: number;
      conversionRate: number;
      averageValue: number;
    }>;
    trends: Array<{
      date: string;
      newLeads: number;
      qualifiedLeads: number;
      convertedLeads: number;
    }>;
  }> => {
    return apiService.get('/analytics/leads', params);
  },

  getEmailInsights: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    campaignId?: string;
  }): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
    topPerformingSubjects: Array<{
      subject: string;
      openRate: number;
      clickRate: number;
    }>;
  }> => {
    return apiService.get('/analytics/emails', params);
  },

  exportData: async (params: {
    type: 'leads' | 'emails' | 'analytics';
    format: 'csv' | 'xlsx' | 'json';
    dateFrom?: string;
    dateTo?: string;
    filters?: Record<string, any>;
  }): Promise<{ downloadUrl: string; expiresAt: string }> => {
    return apiService.post('/analytics/export', params);
  },
};
