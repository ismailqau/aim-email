/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

import React from 'react';
import { cn } from '../../utils';

/**
 * Loading Components for Dashboard
 * Provides various loading states and animations
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      <svg
        className='w-full h-full'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className = '',
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      <div
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          colorClasses[color]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          colorClasses[color]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          colorClasses[color]
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

interface LoadingPulseProps {
  className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
  className = '',
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className='bg-gray-300 rounded h-4 w-full mb-2' />
      <div className='bg-gray-300 rounded h-4 w-3/4 mb-2' />
      <div className='bg-gray-300 rounded h-4 w-1/2' />
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height)
    style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
};

interface CardSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = '',
  showAvatar = false,
  lines = 3,
}) => {
  return (
    <div className={cn('p-4 border border-gray-200 rounded-lg', className)}>
      <div className='animate-pulse'>
        {showAvatar && (
          <div className='flex items-center space-x-3 mb-4'>
            <Skeleton variant='circular' width={40} height={40} />
            <div className='flex-1'>
              <Skeleton className='h-4 w-24 mb-2' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        )}
        <div className='space-y-2'>
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className='animate-pulse'>
        {/* Header */}
        <div className='flex space-x-4 mb-4 pb-2 border-b border-gray-200'>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className='h-4 flex-1' />
          ))}
        </div>

        {/* Rows */}
        <div className='space-y-3'>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className='flex space-x-4'>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={`h-4 flex-1 ${
                    colIndex === 0
                      ? 'w-1/4'
                      : colIndex === columns - 1
                        ? 'w-1/6'
                        : 'w-full'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ChartSkeletonProps {
  className?: string;
  type?: 'bar' | 'line' | 'pie';
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  className = '',
  type = 'bar',
}) => {
  return (
    <div className={cn('w-full h-64 p-4', className)}>
      <div className='animate-pulse h-full'>
        {type === 'bar' && (
          <div className='flex items-end justify-between h-full space-x-2'>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton
                key={index}
                className='flex-1'
                height={Math.random() * 150 + 50}
              />
            ))}
          </div>
        )}

        {type === 'line' && (
          <div className='relative h-full'>
            <Skeleton className='w-full h-full' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-3/4 h-px bg-gray-400 transform rotate-12' />
            </div>
          </div>
        )}

        {type === 'pie' && (
          <div className='flex items-center justify-center h-full'>
            <Skeleton variant='circular' width={200} height={200} />
          </div>
        )}
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className = '',
  message = 'Loading...',
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg'>
          <div className='text-center'>
            <LoadingSpinner size='lg' className='mx-auto mb-4' />
            <p className='text-gray-600 font-medium'>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  color = 'primary',
  size = 'md',
  showLabel = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className='flex justify-between text-sm text-gray-600 mb-1'>
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  LoadingOverlay,
  ProgressBar,
};
