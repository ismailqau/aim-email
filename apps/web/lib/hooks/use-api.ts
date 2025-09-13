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
import { ApiError, PaginatedResponse } from '../api-service';

// Generic API state interface
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  lastFetch: Date | null;
}

// Hook options interface
export interface UseApiOptions {
  immediate?: boolean;
  refreshInterval?: number;
  retryOnError?: boolean;
  maxRetries?: number;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): ApiState<T> & {
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const {
    immediate = true,
    refreshInterval,
    retryOnError = false,
    maxRetries = 3,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null,
  });

  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      if (mountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null,
          lastFetch: new Date(),
        });
        retryCountRef.current = 0;
      }
    } catch (error) {
      if (mountedRef.current) {
        const apiError = error as ApiError;
        setState(prev => ({
          ...prev,
          loading: false,
          error: apiError,
        }));

        // Retry logic
        if (retryOnError && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setTimeout(() => execute(), 1000 * retryCountRef.current);
        }
      }
    }
  }, [apiCall, retryOnError, maxRetries]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastFetch: null,
    });
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Set up refresh interval
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(execute, refreshInterval);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [execute, immediate, refreshInterval]);

  return {
    ...state,
    refetch: execute,
    reset,
  };
}

// Mutation hook for POST/PUT/DELETE operations
export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
): {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
} {
  const [state, setState] = useState<{
    data: TData | null;
    loading: boolean;
    error: ApiError | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await mutationFn(variables);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setState({ data: null, loading: false, error: apiError });
        throw apiError;
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    mutate,
    ...state,
    reset,
  };
}

// Paginated data hook
export function usePaginatedApi<T>(
  apiCall: (params: {
    page: number;
    limit: number;
    [key: string]: any;
  }) => Promise<PaginatedResponse<T>>,
  initialParams: { page?: number; limit?: number; [key: string]: any } = {}
): {
  data: T[];
  pagination: PaginatedResponse<T>['pagination'] | null;
  loading: boolean;
  error: ApiError | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setParams: (params: { [key: string]: any }) => void;
} {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const [state, setState] = useState<{
    data: T[];
    pagination: PaginatedResponse<T>['pagination'] | null;
    loading: boolean;
    error: ApiError | null;
    hasMore: boolean;
  }>({
    data: [],
    pagination: null,
    loading: false,
    error: null,
    hasMore: true,
  });

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall(params);
        setState(prev => ({
          data: isLoadMore ? [...prev.data, ...result.data] : result.data,
          pagination: result.pagination,
          loading: false,
          error: null,
          hasMore: result.pagination.page < result.pagination.totalPages,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as ApiError,
        }));
      }
    },
    [apiCall, params]
  );

  const loadMore = useCallback(async () => {
    if (state.hasMore && !state.loading) {
      const nextPage = (state.pagination?.page || 0) + 1;
      setParams(prev => ({ ...prev, page: nextPage }));
    }
  }, [state.hasMore, state.loading, state.pagination]);

  const refresh = useCallback(async () => {
    setParams(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateParams = useCallback((newParams: { [key: string]: any }) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  useEffect(() => {
    fetchData(params.page > 1);
  }, [fetchData, params]);

  return {
    data: state.data,
    pagination: state.pagination,
    loading: state.loading,
    error: state.error,
    loadMore,
    refresh,
    setParams: updateParams,
  };
}

// File upload hook
export function useFileUpload<T>(
  uploadFn: (file: File, onProgress?: (progress: number) => void) => Promise<T>
): {
  upload: (file: File) => Promise<T>;
  progress: number;
  loading: boolean;
  error: ApiError | null;
  data: T | null;
  reset: () => void;
} {
  const [state, setState] = useState<{
    progress: number;
    loading: boolean;
    error: ApiError | null;
    data: T | null;
  }>({
    progress: 0,
    loading: false,
    error: null,
    data: null,
  });

  const upload = useCallback(
    async (file: File): Promise<T> => {
      setState({ progress: 0, loading: true, error: null, data: null });

      try {
        const result = await uploadFn(file, progress => {
          setState(prev => ({ ...prev, progress }));
        });
        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
          progress: 100,
        }));
        return result;
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error as ApiError,
          progress: 0,
        }));
        throw error;
      }
    },
    [uploadFn]
  );

  const reset = useCallback(() => {
    setState({ progress: 0, loading: false, error: null, data: null });
  }, []);

  return {
    upload,
    ...state,
    reset,
  };
}
