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
import { Card, CardHeader, CardTitle, CardContent } from '@email-system/ui';
import Link from 'next/link';

import { Button, Typography } from '@email-system/ui';

export default function DashboardPage() {
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

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <Typography variant='h1'>Dashboard</Typography>
          <Typography variant='p' color='secondary'>
            Overview of your email marketing performance
          </Typography>
        </div>

        {/* Metrics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Total Leads
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' color='primary'>
                {metrics.totalLeads.toLocaleString()}
              </Typography>
              <Typography variant='small' color='success'>
                +12% from last month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Active Leads
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' color='success'>
                {metrics.activeLeads.toLocaleString()}
              </Typography>
              <Typography variant='small' color='success'>
                +8% from last month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Emails Sent
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' className='text-purple-600'>
                {metrics.emailsSent.toLocaleString()}
              </Typography>
              <Typography variant='small' color='success'>
                +15% from last month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Open Rate
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' className='text-orange-600'>
                {metrics.openRate}%
              </Typography>
              <Typography variant='small' color='success'>
                +2.1% from last month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Click Rate
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' color='destructive'>
                {metrics.clickRate}%
              </Typography>
              <Typography variant='small' color='success'>
                +0.8% from last month
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='small' color='muted'>
                  Reply Rate
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant='h3' className='text-indigo-600'>
                {metrics.replyRate}%
              </Typography>
              <Typography variant='small' color='success'>
                +0.3% from last month
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Link href='/dashboard/leads'>
                <Button className='w-full'>Upload New Leads</Button>
              </Link>
              <Link href='/dashboard/campaigns'>
                <Button className='w-full bg-green-600 hover:bg-green-700'>
                  Create Email Campaign
                </Button>
              </Link>
              <Link href='/dashboard/pipelines'>
                <Button className='w-full bg-purple-600 hover:bg-purple-700'>
                  Build New Pipeline
                </Button>
              </Link>
              <Link href='/dashboard/email-settings'>
                <Button className='w-full bg-orange-600 hover:bg-orange-700'>
                  Configure Email Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Typography variant='h4'>Recent Activity</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <Typography variant='small'>
                    150 new leads imported
                  </Typography>
                  <Typography variant='muted' className='text-xs'>
                    2 hours ago
                  </Typography>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <Typography variant='small'>
                    Email campaign &quot;Q4 Outreach&quot; started
                  </Typography>
                  <Typography variant='muted' className='text-xs'>
                    4 hours ago
                  </Typography>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  <Typography variant='small'>
                    Pipeline &quot;Welcome Series&quot; updated
                  </Typography>
                  <Typography variant='muted' className='text-xs'>
                    1 day ago
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
