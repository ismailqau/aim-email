/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  DashboardLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Typography,
  SimpleBarChart,
  SimpleLineChart,
  MetricCard,
} from '@email-system/ui';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics] = useState({
    totalRevenue: 45230,
    conversionRate: 3.2,
    avgOrderValue: 127.5,
    customerLifetimeValue: 890,
    bounceRate: 24.5,
    sessionDuration: 245,
  });

  // Sample data for charts
  const revenueData = [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 15000 },
    { label: 'Mar', value: 18000 },
    { label: 'Apr', value: 22000 },
    { label: 'May', value: 25000 },
    { label: 'Jun', value: 28000 },
  ];

  const conversionData = [
    { label: 'Week 1', value: 2.8 },
    { label: 'Week 2', value: 3.1 },
    { label: 'Week 3', value: 2.9 },
    { label: 'Week 4', value: 3.4 },
    { label: 'Week 5', value: 3.2 },
    { label: 'Week 6', value: 3.6 },
  ];

  const trafficData = [
    { label: 'Organic', value: 45, color: '#10B981' },
    { label: 'Direct', value: 25, color: '#3B82F6' },
    { label: 'Social', value: 15, color: '#8B5CF6' },
    { label: 'Email', value: 10, color: '#F59E0B' },
    { label: 'Referral', value: 5, color: '#EF4444' },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/analytics');
        // const data = await response.json();
        // setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <Typography
              variant='h1'
              className='text-3xl font-bold text-gray-900 mb-2'
            >
              Analytics
            </Typography>
            <Typography variant='p' className='text-gray-600'>
              Detailed insights into your email marketing performance
            </Typography>
          </div>

          {/* Time Range Selector */}
          <div className='flex space-x-2'>
            {['7d', '30d', '90d', '1y'].map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size='sm'
                onClick={() => setTimeRange(range)}
              >
                {range === '7d'
                  ? '7 Days'
                  : range === '30d'
                    ? '30 Days'
                    : range === '90d'
                      ? '90 Days'
                      : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8'>
          <MetricCard
            title='Total Revenue'
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            change={{ value: '+12.5%', type: 'increase' }}
            color='green'
          />
          <MetricCard
            title='Conversion Rate'
            value={`${analytics.conversionRate}%`}
            change={{ value: '+0.3%', type: 'increase' }}
            color='blue'
          />
          <MetricCard
            title='Avg Order Value'
            value={`$${analytics.avgOrderValue}`}
            change={{ value: '-2.1%', type: 'decrease' }}
            color='orange'
          />
          <MetricCard
            title='Customer LTV'
            value={`$${analytics.customerLifetimeValue}`}
            change={{ value: '+8.7%', type: 'increase' }}
            color='purple'
          />
          <MetricCard
            title='Bounce Rate'
            value={`${analytics.bounceRate}%`}
            change={{ value: '-1.2%', type: 'decrease' }}
            color='red'
          />
          <MetricCard
            title='Session Duration'
            value={`${Math.floor(analytics.sessionDuration / 60)}m ${analytics.sessionDuration % 60}s`}
            change={{ value: '+15s', type: 'increase' }}
            color='indigo'
          />
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={revenueData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={conversionData} />
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources & Campaign Performance */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {trafficData.map((source, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <Typography variant='small'>{source.label}</Typography>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Typography variant='small' className='font-medium'>
                        {source.value}%
                      </Typography>
                      <div className='w-20 bg-gray-200 rounded-full h-2'>
                        <div
                          className='h-2 rounded-full'
                          style={{
                            width: `${source.value}%`,
                            backgroundColor: source.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <div>
                    <Typography variant='small' className='font-medium'>
                      Summer Sale 2024
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      Email Campaign
                    </Typography>
                  </div>
                  <div className='text-right'>
                    <Typography
                      variant='small'
                      className='font-medium text-green-600'
                    >
                      $12,450
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      4.2% CTR
                    </Typography>
                  </div>
                </div>

                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <div>
                    <Typography variant='small' className='font-medium'>
                      Welcome Series
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      Automated Sequence
                    </Typography>
                  </div>
                  <div className='text-right'>
                    <Typography
                      variant='small'
                      className='font-medium text-green-600'
                    >
                      $8,920
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      3.8% CTR
                    </Typography>
                  </div>
                </div>

                <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                  <div>
                    <Typography variant='small' className='font-medium'>
                      Product Launch
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      Newsletter
                    </Typography>
                  </div>
                  <div className='text-right'>
                    <Typography
                      variant='small'
                      className='font-medium text-green-600'
                    >
                      $6,780
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-gray-500 text-sm'
                    >
                      3.1% CTR
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex space-x-4'>
              <Button variant='outline'>Export as PDF</Button>
              <Button variant='outline'>Export as CSV</Button>
              <Button variant='outline'>Schedule Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
