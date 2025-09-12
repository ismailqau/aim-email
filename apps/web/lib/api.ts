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

import apiClient from './api-client';
import type { User, Company, Lead, Pipeline, Email } from '@email-system/types';

export const authApi = {
  register: (userData: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  logout: () => apiClient.post('/auth/logout'),
};

export const usersApi = {
  getProfile: () => apiClient.get('/users/me'),

  updateProfile: (data: Partial<User>) => apiClient.put('/users/me', data),
};

export const companiesApi = {
  getCompanies: () => apiClient.get('/companies'),

  createCompany: (data: Partial<Company>) => apiClient.post('/companies', data),

  updateCompany: (id: string, data: Partial<Company>) =>
    apiClient.put(`/companies/${id}`, data),
};

export const leadsApi = {
  getLeads: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get('/leads', { params }),

  createLead: (data: Partial<Lead>) => apiClient.post('/leads', data),

  uploadLeads: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/leads/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateLead: (id: string, data: Partial<Lead>) =>
    apiClient.put(`/leads/${id}`, data),

  deleteLead: (id: string) => apiClient.delete(`/leads/${id}`),
};

export const pipelinesApi = {
  getPipelines: () => apiClient.get('/pipelines'),

  createPipeline: (data: Partial<Pipeline>) =>
    apiClient.post('/pipelines', data),

  updatePipeline: (id: string, data: Partial<Pipeline>) =>
    apiClient.put(`/pipelines/${id}`, data),

  startPipeline: (id: string, leadIds: string[]) =>
    apiClient.post(`/pipelines/${id}/start`, { leadIds }),
};

export const emailsApi = {
  generateEmail: (data: { leadId: string; template?: string; context?: any }) =>
    apiClient.post('/emails/generate', data),

  sendEmail: (data: { leadId: string; subject: string; content: string }) =>
    apiClient.post('/emails/send', data),

  getTemplates: () => apiClient.get('/emails/templates'),

  createTemplate: (data: { name: string; subject: string; content: string }) =>
    apiClient.post('/emails/templates', data),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),

  getPerformance: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get('/analytics/performance', { params }),

  exportData: (params: {
    type: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.post('/analytics/export', params),
};
