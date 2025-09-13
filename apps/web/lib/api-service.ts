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

import { AxiosResponse, AxiosError } from 'axios';
import apiClient from './api-client';

// Enhanced API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};

// Enhanced API service class
export class ApiService {
  private static instance: ApiService;
  private retryConfig: RetryConfig;

  private constructor(retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.retryConfig = retryConfig;
  }

  public static getInstance(retryConfig?: RetryConfig): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(retryConfig);
    }
    return ApiService.instance;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeWithRetry<T>(
    operation: () => Promise<AxiosResponse<T>>,
    retryCount = 0
  ): Promise<AxiosResponse<T>> {
    try {
      return await operation();
    } catch (error) {
      const axiosError = error as AxiosError;

      if (
        retryCount < this.retryConfig.maxRetries &&
        this.retryConfig.retryCondition?.(axiosError)
      ) {
        await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount));
        return this.executeWithRetry(operation, retryCount + 1);
      }

      throw this.handleError(axiosError);
    }
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const errorData = data as any;
      apiError.message = errorData?.message || `Server error: ${status}`;
      apiError.code = errorData?.code || status.toString();
      apiError.details = errorData?.details;
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error: Unable to reach server';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Request setup error
      apiError.message = error.message || 'Request configuration error';
      apiError.code = 'REQUEST_ERROR';
    }

    return apiError;
  }

  // Generic CRUD operations
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.executeWithRetry(() =>
      apiClient.get<ApiResponse<T>>(url, { params })
    );
    return response.data.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.executeWithRetry(() =>
      apiClient.post<ApiResponse<T>>(url, data, config)
    );
    return response.data.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.executeWithRetry(() =>
      apiClient.put<ApiResponse<T>>(url, data)
    );
    return response.data.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.executeWithRetry(() =>
      apiClient.patch<ApiResponse<T>>(url, data)
    );
    return response.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.executeWithRetry(() =>
      apiClient.delete<ApiResponse<T>>(url)
    );
    return response.data.data;
  }

  // Paginated requests
  async getPaginated<T>(
    url: string,
    params?: { page?: number; limit?: number; [key: string]: any }
  ): Promise<PaginatedResponse<T>> {
    const response = await this.executeWithRetry(() =>
      apiClient.get<ApiResponse<PaginatedResponse<T>>>(url, { params })
    );
    return response.data.data;
  }

  // File upload with progress
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.executeWithRetry(() =>
      apiClient.post<ApiResponse<T>>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      })
    );
    return response.data.data;
  }

  // Batch operations
  async batch<T>(operations: Array<() => Promise<any>>): Promise<T[]> {
    const results = await Promise.allSettled(operations.map(op => op()));

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Batch operation ${index} failed:`, result.reason);
        throw result.reason;
      }
    });
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();
