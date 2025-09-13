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
  Badge,
} from '@email-system/ui';

interface Report {
  id: string;
  name: string;
  type: 'email' | 'sales' | 'user' | 'performance';
  status: 'completed' | 'processing' | 'scheduled' | 'failed';
  createdAt: string;
  size: string;
  downloadUrl?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    // Mock reports data - in a real app, this would be an API call
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Monthly Email Performance Report',
        type: 'email',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        size: '2.4 MB',
        downloadUrl: '/reports/email-performance-jan-2024.pdf',
      },
      {
        id: '2',
        name: 'Q4 Sales Analytics Report',
        type: 'sales',
        status: 'completed',
        createdAt: '2024-01-14T16:45:00Z',
        size: '5.1 MB',
        downloadUrl: '/reports/sales-analytics-q4-2023.pdf',
      },
      {
        id: '3',
        name: 'User Engagement Report',
        type: 'user',
        status: 'processing',
        createdAt: '2024-01-15T14:20:00Z',
        size: 'Processing...',
      },
      {
        id: '4',
        name: 'Weekly Performance Summary',
        type: 'performance',
        status: 'scheduled',
        createdAt: '2024-01-16T09:00:00Z',
        size: 'Scheduled',
      },
      {
        id: '5',
        name: 'Campaign ROI Analysis',
        type: 'email',
        status: 'failed',
        createdAt: '2024-01-13T11:15:00Z',
        size: 'Failed',
      },
    ];
    setReports(mockReports);
  }, []);

  // Sample data for report insights
  const reportMetrics = {
    totalReports: 156,
    completedReports: 142,
    scheduledReports: 8,
    failedReports: 6,
  };

  const reportTrendsData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 58 },
    { label: 'Jun', value: 67 },
  ];

  const reportTypesData = [
    { label: 'Week 1', value: 12 },
    { label: 'Week 2', value: 15 },
    { label: 'Week 3', value: 18 },
    { label: 'Week 4', value: 20 },
  ];

  const filteredReports = reports.filter(
    report => selectedReportType === 'all' || report.type === selectedReportType
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-purple-100 text-purple-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

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
              Reports
            </Typography>
            <Typography variant='p' className='text-gray-600'>
              Generate, schedule, and download comprehensive business reports
            </Typography>
          </div>

          <Button className='bg-blue-600 hover:bg-blue-700'>
            Generate New Report
          </Button>
        </div>

        {/* Report Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-blue-600 mb-2'
              >
                {reportMetrics.totalReports}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Total Reports
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-green-600 mb-2'
              >
                {reportMetrics.completedReports}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Completed
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-yellow-600 mb-2'
              >
                {reportMetrics.scheduledReports}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Scheduled
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-red-600 mb-2'
              >
                {reportMetrics.failedReports}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Failed
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Report Generation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={reportTrendsData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={reportTypesData} />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Report Type
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={selectedReportType}
                  onChange={e => setSelectedReportType(e.target.value)}
                >
                  <option value='all'>All Types</option>
                  <option value='email'>Email Reports</option>
                  <option value='sales'>Sales Reports</option>
                  <option value='user'>User Reports</option>
                  <option value='performance'>Performance Reports</option>
                </select>
              </div>

              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Date Range
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                >
                  <option value='7d'>Last 7 Days</option>
                  <option value='30d'>Last 30 Days</option>
                  <option value='90d'>Last 90 Days</option>
                  <option value='1y'>Last Year</option>
                </select>
              </div>

              <div className='flex items-end'>
                <Button variant='outline' className='w-full'>
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Report Name
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Type
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Status
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Created
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Size
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr
                      key={report.id}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='py-4 px-4'>
                        <Typography variant='small' className='font-medium'>
                          {report.name}
                        </Typography>
                      </td>
                      <td className='py-4 px-4'>
                        <Badge className={getTypeBadgeColor(report.type)}>
                          {report.type.charAt(0).toUpperCase() +
                            report.type.slice(1)}
                        </Badge>
                      </td>
                      <td className='py-4 px-4'>
                        <Badge className={getStatusBadgeColor(report.status)}>
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </Badge>
                      </td>
                      <td className='py-4 px-4'>
                        <Typography variant='small' className='text-gray-600'>
                          {formatDate(report.createdAt)}
                        </Typography>
                      </td>
                      <td className='py-4 px-4'>
                        <Typography variant='small' className='text-gray-600'>
                          {report.size}
                        </Typography>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex space-x-2'>
                          {report.status === 'completed' && (
                            <Button variant='outline' size='sm'>
                              Download
                            </Button>
                          )}
                          {report.status === 'failed' && (
                            <Button variant='outline' size='sm'>
                              Retry
                            </Button>
                          )}
                          <Button variant='outline' size='sm'>
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Button
                variant='outline'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Typography variant='small' className='font-medium'>
                  Email Performance
                </Typography>
                <Typography variant='small' className='text-gray-500 text-sm'>
                  Weekly summary
                </Typography>
              </Button>

              <Button
                variant='outline'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Typography variant='small' className='font-medium'>
                  Sales Analytics
                </Typography>
                <Typography variant='small' className='text-gray-500 text-sm'>
                  Monthly report
                </Typography>
              </Button>

              <Button
                variant='outline'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Typography variant='small' className='font-medium'>
                  User Engagement
                </Typography>
                <Typography variant='small' className='text-gray-500 text-sm'>
                  Quarterly analysis
                </Typography>
              </Button>

              <Button
                variant='outline'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Typography variant='small' className='font-medium'>
                  Custom Report
                </Typography>
                <Typography variant='small' className='text-gray-500 text-sm'>
                  Build your own
                </Typography>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
