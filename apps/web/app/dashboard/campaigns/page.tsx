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

import React, { useState, useEffect, useCallback } from 'react';
import {
  DashboardLayout,
  Button,
  Typography,
  Badge,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  SearchIcon,
  TemplateIcon,
} from '@email-system/ui';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  pipelineSteps: {
    id: string;
    order: number;
    emailTemplate?: {
      id: string;
      name: string;
    };
  }[];
  stats: {
    totalExecutions: number;
    activeExecutions: number;
    completedExecutions: number;
    completionRate: number;
  };
}

interface CampaignsResponse {
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`/api/campaigns?${params}`);
      if (response.ok) {
        const data: CampaignsResponse = await response.json();
        setCampaigns(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCampaignAction = async (
    campaignId: string,
    action: 'start' | 'pause'
  ) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh campaigns list
        fetchCampaigns();
      } else {
        throw new Error(`Failed to ${action} campaign`);
      }
    } catch (error) {
      console.error(`Campaign ${action} error:`, error);
      alert(`Failed to ${action} campaign. Please try again.`);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout
      title='Email Campaigns'
      subtitle='Manage and monitor your email campaigns'
      actions={
        <div className='flex space-x-3'>
          <Link href='/dashboard/campaigns/templates'>
            <Button variant='outline' className='flex items-center space-x-2'>
              <TemplateIcon size={16} />
              <span>Templates</span>
            </Button>
          </Link>
          <Link href='/dashboard/campaigns/create'>
            <Button className='flex items-center space-x-2'>
              <PlusIcon size={16} />
              <span>Create Campaign</span>
            </Button>
          </Link>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Search and Filters */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <SearchIcon
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Search campaigns by name or description...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex gap-3'>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse'
              >
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='h-3 bg-gray-200 rounded w-full mb-4'></div>
                <div className='flex justify-between items-center mb-4'>
                  <div className='h-6 bg-gray-200 rounded w-16'></div>
                  <div className='h-8 bg-gray-200 rounded w-20'></div>
                </div>
                <div className='space-y-2'>
                  <div className='h-3 bg-gray-200 rounded w-full'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            ))
          ) : campaigns.length === 0 ? (
            <div className='col-span-full'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
                <Typography variant='p' className='text-gray-500 mb-4'>
                  No campaigns found. Create your first campaign to get started.
                </Typography>
                <Link href='/dashboard/campaigns/create'>
                  <Button className='flex items-center space-x-2 mx-auto'>
                    <PlusIcon size={16} />
                    <span>Create Campaign</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            campaigns.map(campaign => (
              <div
                key={campaign.id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
              >
                {/* Campaign Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <Typography
                      variant='h3'
                      className='text-lg font-semibold text-gray-900 mb-1'
                    >
                      {campaign.name}
                    </Typography>
                    {campaign.description && (
                      <Typography variant='small' className='text-gray-600'>
                        {campaign.description}
                      </Typography>
                    )}
                  </div>
                  <Badge className={getStatusColor(campaign.isActive)}>
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Campaign Stats */}
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div className='text-center p-3 bg-gray-50 rounded-lg'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {campaign.stats.totalExecutions}
                    </div>
                    <div className='text-xs text-gray-500'>Total Sent</div>
                  </div>
                  <div className='text-center p-3 bg-gray-50 rounded-lg'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {campaign.stats.activeExecutions}
                    </div>
                    <div className='text-xs text-gray-500'>Active</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-sm text-gray-600'>
                      Completion Rate
                    </span>
                    <span
                      className={`text-sm font-medium ${getCompletionRateColor(campaign.stats.completionRate)}`}
                    >
                      {campaign.stats.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${campaign.stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Campaign Steps */}
                <div className='mb-4'>
                  <Typography variant='small' className='text-gray-600 mb-2'>
                    Steps ({campaign.pipelineSteps.length})
                  </Typography>
                  <div className='space-y-1'>
                    {campaign.pipelineSteps.slice(0, 3).map(step => (
                      <div
                        key={step.id}
                        className='text-xs text-gray-500 flex items-center'
                      >
                        <span className='w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs'>
                          {step.order}
                        </span>
                        {step.emailTemplate?.name || 'Untitled Template'}
                      </div>
                    ))}
                    {campaign.pipelineSteps.length > 3 && (
                      <div className='text-xs text-gray-400'>
                        +{campaign.pipelineSteps.length - 3} more steps
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      handleCampaignAction(
                        campaign.id,
                        campaign.isActive ? 'pause' : 'start'
                      )
                    }
                    className='flex items-center space-x-1 flex-1'
                  >
                    {campaign.isActive ? (
                      <>
                        <PauseIcon size={14} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon size={14} />
                        <span>Start</span>
                      </>
                    )}
                  </Button>
                  <Button variant='ghost' size='sm' className='flex-1'>
                    View Details
                  </Button>
                </div>

                {/* Created Date */}
                <div className='mt-3 pt-3 border-t border-gray-100'>
                  <Typography variant='small' className='text-gray-400'>
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
                {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
                {pagination.total} campaigns
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
