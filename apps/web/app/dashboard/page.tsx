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

'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@email-system/ui';
import Link from 'next/link';

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
    // TODO: Fetch dashboard metrics from API
    // Example mock data
    setMetrics({
      totalLeads: 1250,
      activeLeads: 980,
      emailsSent: 3450,
      openRate: 24.5,
      clickRate: 3.2,
      replyRate: 1.8,
    });
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600'>
            Overview of your email marketing performance
          </p>
        </div>

        {/* Metrics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-blue-600'>
                {metrics.totalLeads.toLocaleString()}
              </p>
              <p className='text-sm text-green-600'>+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>
                Active Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-green-600'>
                {metrics.activeLeads.toLocaleString()}
              </p>
              <p className='text-sm text-green-600'>+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>
                Emails Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-purple-600'>
                {metrics.emailsSent.toLocaleString()}
              </p>
              <p className='text-sm text-green-600'>+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>Open Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-orange-600'>
                {metrics.openRate}%
              </p>
              <p className='text-sm text-green-600'>+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>
                Click Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-red-600'>
                {metrics.clickRate}%
              </p>
              <p className='text-sm text-green-600'>+0.8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm text-gray-600'>
                Reply Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-indigo-600'>
                {metrics.replyRate}%
              </p>
              <p className='text-sm text-green-600'>+0.3% from last month</p>
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
                <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'>
                  Upload New Leads
                </button>
              </Link>
              <Link href='/dashboard/campaigns'>
                <button className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700'>
                  Create Email Campaign
                </button>
              </Link>
              <Link href='/dashboard/pipelines'>
                <button className='w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700'>
                  Build New Pipeline
                </button>
              </Link>
              <Link href='/dashboard/email-settings'>
                <button className='w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700'>
                  Configure Email Settings
                </button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <p className='text-sm'>150 new leads imported</p>
                  <span className='text-xs text-gray-500'>2 hours ago</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <p className='text-sm'>
                    Email campaign "Q4 Outreach" started
                  </p>
                  <span className='text-xs text-gray-500'>4 hours ago</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                  <p className='text-sm'>Pipeline "Welcome Series" updated</p>
                  <span className='text-xs text-gray-500'>1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
