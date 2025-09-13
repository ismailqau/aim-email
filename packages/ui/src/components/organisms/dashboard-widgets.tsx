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

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Typography } from '../atoms/typography';
import { Badge } from '../atoms/badge';
import { Button } from '../atoms/button';

// Icons for metrics
const TrendUpIcon = () => (
  <svg
    className='w-4 h-4'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    />
  </svg>
);

const TrendDownIcon = () => (
  <svg
    className='w-4 h-4'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    />
  </svg>
);

const ClickIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122'
    />
  </svg>
);

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ComponentType;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    indigo: 'text-indigo-600 bg-indigo-100',
  };

  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Typography variant='small' className='text-sm font-medium'>
              {title}
            </Typography>
            <Typography variant='h3' className='mt-2 font-bold'>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {change && (
              <div className='flex items-center mt-2'>
                {change.type === 'increase' ? (
                  <div className='text-green-500 mr-1'>
                    <TrendUpIcon />
                  </div>
                ) : change.type === 'decrease' ? (
                  <div className='text-red-500 mr-1'>
                    <TrendDownIcon />
                  </div>
                ) : null}
                <Typography
                  variant='small'
                  className={`font-medium ${
                    change.type === 'increase'
                      ? 'text-green-600'
                      : change.type === 'decrease'
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {change.value}
                </Typography>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple Chart Component (SVG-based)
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  height?: number;
  className?: string;
}

export function SimpleBarChart({
  data,
  height = 200,
  className = '',
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 40;
  const barSpacing = 20;
  const chartWidth = data.length * (barWidth + barSpacing) - barSpacing;
  const padding = 40;

  return (
    <div className={`w-full ${className}`}>
      <svg
        width='100%'
        height={height}
        viewBox={`0 0 ${chartWidth + padding * 2} ${height}`}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - padding * 2);
          const x = padding + index * (barWidth + barSpacing);
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || '#3B82F6'}
                rx={4}
                className='hover:opacity-80 transition-opacity'
              />
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor='middle'
                className='text-xs fill-gray-600'
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor='middle'
                className='text-xs fill-gray-800 font-medium'
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface SimpleLineChartProps {
  data: ChartData[];
  height?: number;
  className?: string;
  color?: string;
}

export function SimpleLineChart({
  data,
  height = 200,
  className = '',
  color = '#3B82F6',
}: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 40;
  const chartWidth = 400;
  const stepX = (chartWidth - padding * 2) / (data.length - 1);

  const points = data
    .map((item, index) => {
      const x = padding + index * stepX;
      const y =
        padding + ((maxValue - item.value) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`w-full ${className}`}>
      <svg width='100%' height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke='#E5E7EB'
              strokeWidth={1}
            />
          );
        })}

        {/* Line */}
        <polyline
          points={points}
          fill='none'
          stroke={color}
          strokeWidth={3}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Points */}
        {data.map((item, index) => {
          const x = padding + index * stepX;
          const y =
            padding +
            ((maxValue - item.value) / range) * (height - padding * 2);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill={color}
                className='hover:r-6 transition-all'
              />
              <text
                x={x}
                y={height - padding + 20}
                textAnchor='middle'
                className='text-xs fill-gray-600'
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Performance Metrics Dashboard
interface PerformanceMetricsProps {
  metrics: {
    totalLeads: number;
    activeLeads: number;
    emailsSent: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <MetricCard
        title='Total Leads'
        value={metrics.totalLeads}
        change={{ value: '+12% from last month', type: 'increase' }}
        icon={UsersIcon}
        color='blue'
      />

      <MetricCard
        title='Active Leads'
        value={metrics.activeLeads}
        change={{ value: '+8% from last month', type: 'increase' }}
        icon={UsersIcon}
        color='green'
      />

      <MetricCard
        title='Emails Sent'
        value={metrics.emailsSent}
        change={{ value: '+15% from last month', type: 'increase' }}
        icon={EmailIcon}
        color='purple'
      />

      <MetricCard
        title='Open Rate'
        value={`${metrics.openRate}%`}
        change={{ value: '+2.1% from last month', type: 'increase' }}
        icon={EyeIcon}
        color='orange'
      />

      <MetricCard
        title='Click Rate'
        value={`${metrics.clickRate}%`}
        change={{ value: '+0.8% from last month', type: 'increase' }}
        icon={ClickIcon}
        color='red'
      />

      <MetricCard
        title='Reply Rate'
        value={`${metrics.replyRate}%`}
        change={{ value: '+0.3% from last month', type: 'increase' }}
        icon={EmailIcon}
        color='indigo'
      />
    </div>
  );
}

// Quick Actions Widget
export function QuickActions() {
  const actions = [
    {
      title: 'Upload New Leads',
      description: 'Import leads from CSV or integrate with CRM',
      href: '/dashboard/leads',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: UsersIcon,
    },
    {
      title: 'Create Email Campaign',
      description: 'Design and launch new email campaigns',
      href: '/dashboard/campaigns',
      color: 'bg-green-600 hover:bg-green-700',
      icon: EmailIcon,
    },
    {
      title: 'View Analytics',
      description: 'Analyze campaign performance and metrics',
      href: '/dashboard/analytics',
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: EyeIcon,
    },
    {
      title: 'Generate Reports',
      description: 'Create detailed performance reports',
      href: '/dashboard/reports',
      color: 'bg-orange-600 hover:bg-orange-700',
      icon: ClickIcon,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {actions.map((action, index) => (
            <a href={action.href} key={index}>
              <Button
                variant='ghost'
                className={`h-auto p-4 justify-start ${action.color} text-white hover:text-white w-full`}
              >
                <div className='flex items-center space-x-3'>
                  <action.icon />
                  <div className='text-left'>
                    <div className='font-medium'>{action.title}</div>
                    <div className='text-sm opacity-90'>
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Widget
export function RecentActivity() {
  const activities = [
    {
      type: 'success',
      message: '150 new leads imported',
      time: '2 hours ago',
      color: 'bg-green-500',
    },
    {
      type: 'info',
      message: 'Email campaign "Q4 Outreach" started',
      time: '4 hours ago',
      color: 'bg-blue-500',
    },
    {
      type: 'update',
      message: 'Pipeline "Welcome Series" updated',
      time: '1 day ago',
      color: 'bg-purple-500',
    },
    {
      type: 'warning',
      message: 'Email delivery rate below threshold',
      time: '2 days ago',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Recent Activity</CardTitle>
          <Badge variant='secondary'>Live</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.map((activity, index) => (
            <div key={index} className='flex items-start space-x-3'>
              <div
                className={`w-2 h-2 ${activity.color} rounded-full mt-2`}
              ></div>
              <div className='flex-1 min-w-0'>
                <Typography variant='small' className='font-medium'>
                  {activity.message}
                </Typography>
                <Typography variant='muted' className='text-xs'>
                  {activity.time}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <Button variant='ghost' className='w-full text-sm'>
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
