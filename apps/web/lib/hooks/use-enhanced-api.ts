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

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import {
  authApiEnhanced,
  usersApiEnhanced,
  companiesApiEnhanced,
  leadsApiEnhanced,
  pipelinesApiEnhanced,
  emailsApiEnhanced,
  analyticsApiEnhanced,
} from '../api-enhanced';
import type { Company, Lead } from '@email-system/types';

// Enhanced Auth Hooks
export const useAuthEnhanced = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApiEnhanced.login,
    onSuccess: data => {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      queryClient.setQueryData(['user'], data.user);
      toast.success('Successfully logged in!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApiEnhanced.register,
    onSuccess: data => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApiEnhanced.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      toast.success('Successfully logged out');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApiEnhanced.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApiEnhanced.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isLoading:
      loginMutation.isLoading ||
      registerMutation.isLoading ||
      logoutMutation.isLoading,
    error:
      loginMutation.error || registerMutation.error || logoutMutation.error,
  };
};

// Enhanced User Hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: usersApiEnhanced.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApiEnhanced.updateProfile,
    onSuccess: data => {
      queryClient.setQueryData(['user', 'profile'], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      usersApiEnhanced.uploadAvatar(file, setUploadProgress),
    onSuccess: _data => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Avatar uploaded successfully!');
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
      setUploadProgress(0);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};

// Enhanced Companies Hooks
export const useCompanies = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
}) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApiEnhanced.getCompanies(params),
    keepPreviousData: true,
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companiesApiEnhanced.getCompany(id),
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesApiEnhanced.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create company');
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companiesApiEnhanced.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', id] });
      toast.success('Company updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update company');
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesApiEnhanced.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete company');
    },
  });
};

// Enhanced Leads Hooks
export const useLeads = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  companyId?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApiEnhanced.getLeads(params),
    keepPreviousData: true,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApiEnhanced.getLead(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApiEnhanced.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      leadsApiEnhanced.updateLead(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', id] });
      toast.success('Lead updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApiEnhanced.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete lead');
    },
  });
};

export const useBulkDeleteLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApiEnhanced.bulkDeleteLeads,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`${data.deletedCount} leads deleted successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete leads');
    },
  });
};

export const useUploadLeads = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      leadsApiEnhanced.uploadLeads(file, setUploadProgress),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`${data.imported} leads imported successfully!`);
      if (data.failed > 0) {
        toast.error(`${data.failed} leads failed to import`);
      }
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload leads');
      setUploadProgress(0);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
};

// Enhanced Pipelines Hooks
export const usePipelines = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['pipelines', params],
    queryFn: () => pipelinesApiEnhanced.getPipelines(params),
    keepPreviousData: true,
  });
};

export const usePipeline = (id: string) => {
  return useQuery({
    queryKey: ['pipelines', id],
    queryFn: () => pipelinesApiEnhanced.getPipeline(id),
    enabled: !!id,
  });
};

export const useCreatePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pipelinesApiEnhanced.createPipeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Pipeline created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create pipeline');
    },
  });
};

export const useStartPipeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, config }: { id: string; config: any }) =>
      pipelinesApiEnhanced.startPipeline(id, config),
    onSuccess: _data => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Pipeline started successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start pipeline');
    },
  });
};

// Enhanced Email Hooks
export const useGenerateEmail = () => {
  return useMutation({
    mutationFn: emailsApiEnhanced.generateEmail,
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate email');
    },
  });
};

export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emailsApiEnhanced.sendEmail,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'history'] });
      if (data.scheduledFor) {
        toast.success(
          `Email scheduled for ${new Date(data.scheduledFor).toLocaleString()}`
        );
      } else {
        toast.success('Email sent successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send email');
    },
  });
};

export const useEmailTemplates = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['emails', 'templates', params],
    queryFn: () => emailsApiEnhanced.getTemplates(params),
    keepPreviousData: true,
  });
};

export const useEmailHistory = (params?: {
  page?: number;
  limit?: number;
  leadId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['emails', 'history', params],
    queryFn: () => emailsApiEnhanced.getEmailHistory(params),
    keepPreviousData: true,
  });
};

// Enhanced Analytics Hooks
export const useDashboard = (params?: {
  dateFrom?: string;
  dateTo?: string;
  timezone?: string;
}) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => analyticsApiEnhanced.getDashboard(params),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const usePerformanceAnalytics = (params?: {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
}) => {
  return useQuery({
    queryKey: ['analytics', 'performance', params],
    queryFn: () => analyticsApiEnhanced.getPerformance(params),
    keepPreviousData: true,
  });
};

export const useLeadInsights = (params?: {
  dateFrom?: string;
  dateTo?: string;
  segmentBy?: 'company' | 'industry' | 'source';
}) => {
  return useQuery({
    queryKey: ['analytics', 'leads', params],
    queryFn: () => analyticsApiEnhanced.getLeadInsights(params),
    keepPreviousData: true,
  });
};

export const useEmailInsights = (params?: {
  dateFrom?: string;
  dateTo?: string;
  campaignId?: string;
}) => {
  return useQuery({
    queryKey: ['analytics', 'emails', params],
    queryFn: () => analyticsApiEnhanced.getEmailInsights(params),
    keepPreviousData: true,
  });
};

// Generic Export Hook
export const useExportData = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(
    async (params: {
      type: 'leads' | 'emails' | 'analytics';
      format: 'csv' | 'xlsx' | 'json';
      dateFrom?: string;
      dateTo?: string;
      filters?: Record<string, any>;
    }) => {
      try {
        setIsExporting(true);
        const result = await analyticsApiEnhanced.exportData(params);

        // Create download link
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `export-${params.type}-${Date.now()}.${params.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Export completed successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Export failed');
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportData,
    isExporting,
  };
};

// Real-time Updates Hook
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/ws?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'lead_updated':
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['leads', data.leadId] });
            break;
          case 'email_sent':
            queryClient.invalidateQueries({ queryKey: ['emails', 'history'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            break;
          case 'pipeline_completed':
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success(
              `Pipeline "${data.pipelineName}" completed successfully!`
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsRef.current.onerror = error => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
};
