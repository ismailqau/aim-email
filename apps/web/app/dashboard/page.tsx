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

import { useEffect, useState } from 'react';
import {
  DashboardLayout,
  PerformanceMetrics,
  QuickActions,
  RecentActivity,
  SimpleBarChart,
  SimpleLineChart,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Typography,
} from '@email-system/ui';
import { withAuth } from '@/lib/auth-context';

function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    activeLeads: 0,
    emailsSent: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
  });

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard');
        const data = await response.json();
        if (data) {
          setMetrics(data);
        } else {
          // Fallback to mock data if API fails
          setMetrics({
            totalLeads: 1250,
            activeLeads: 980,
            emailsSent: 3450,
            openRate: 24.5,
            clickRate: 3.2,
            replyRate: 1.8,
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        // Use mock data on error
        setMetrics({
          totalLeads: 1250,
          activeLeads: 980,
          emailsSent: 3450,
          openRate: 24.5,
          clickRate: 3.2,
          replyRate: 1.8,
        });
      }
    };

    fetchDashboardMetrics();
  }, []);

  // Sample chart data
  const chartData = [
    { label: 'Jan', value: 4000 },
    { label: 'Feb', value: 3000 },
    { label: 'Mar', value: 2000 },
    { label: 'Apr', value: 2780 },
    { label: 'May', value: 1890 },
    { label: 'Jun', value: 2390 },
  ];

  const lineData = [
    { label: 'Week 1', value: 24.5 },
    { label: 'Week 2', value: 26.2 },
    { label: 'Week 3', value: 25.8 },
    { label: 'Week 4', value: 28.1 },
  ];

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='mb-8'>
          <Typography
            variant='h1'
            className='text-3xl font-bold text-gray-900 mb-2'
          >
            Email Campaign Dashboard
          </Typography>
          <Typography variant='p' className='text-gray-600'>
            Monitor your email campaigns and track performance metrics
          </Typography>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics metrics={metrics} />

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={lineData} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardPage);
