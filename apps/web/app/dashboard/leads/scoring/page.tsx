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
  ArrowLeftIcon,
  RefreshIcon,
  TrendingUpIcon,
  FilterIcon,
} from '@email-system/ui';
import Link from 'next/link';

interface Lead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  companyName?: string;
  priorityScore?: number;
  status: string;
  createdAt: string;
}

interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
  count: number;
}

export default function LeadScoringPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [scoreRanges, setScoreRanges] = useState<ScoreRange[]>([
    {
      min: 80,
      max: 100,
      label: 'Hot Leads',
      color: 'bg-red-100 text-red-800',
      count: 0,
    },
    {
      min: 60,
      max: 79,
      label: 'Warm Leads',
      color: 'bg-orange-100 text-orange-800',
      count: 0,
    },
    {
      min: 40,
      max: 59,
      label: 'Cold Leads',
      color: 'bg-yellow-100 text-yellow-800',
      count: 0,
    },
    {
      min: 0,
      max: 39,
      label: 'Low Priority',
      color: 'bg-gray-100 text-gray-800',
      count: 0,
    },
  ]);

  const fetchLeads = async (minScore?: number, maxScore?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (minScore !== undefined)
        params.append('minScore', minScore.toString());
      if (maxScore !== undefined)
        params.append('maxScore', maxScore.toString());

      const response = await fetch(`/api/leads/by-score?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScoreDistribution = useCallback(async () => {
    try {
      // Fetch leads for each score range to get counts
      const updatedRanges = await Promise.all(
        scoreRanges.map(async range => {
          const response = await fetch(
            `/api/leads/by-score?minScore=${range.min}&maxScore=${range.max}`
          );
          if (response.ok) {
            const data = await response.json();
            return { ...range, count: data.length };
          }
          return range;
        })
      );
      setScoreRanges(updatedRanges);
    } catch (error) {
      console.error('Failed to fetch score distribution:', error);
    }
  }, [scoreRanges]);

  const calculateAllScores = async () => {
    setCalculating(true);
    try {
      const response = await fetch('/api/leads/bulk-calculate-scores', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Calculated scores for ${result.totalProcessed} leads`);
        // Refresh the data
        await fetchScoreDistribution();
        await fetchLeads();
      } else {
        throw new Error('Failed to calculate scores');
      }
    } catch (error) {
      console.error('Score calculation error:', error);
      alert('Failed to calculate scores. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  const handleRangeFilter = (range: ScoreRange | null) => {
    if (range) {
      setSelectedRange(`${range.min}-${range.max}`);
      fetchLeads(range.min, range.max);
    } else {
      setSelectedRange('all');
      fetchLeads();
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchScoreDistribution();
  }, [fetchScoreDistribution]);

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalLeads = scoreRanges.reduce((sum, range) => sum + range.count, 0);

  return (
    <DashboardLayout
      title='Lead Scoring'
      subtitle='Manage and analyze lead scores'
      actions={
        <div className='flex space-x-3'>
          <Link href='/dashboard/leads'>
            <Button variant='outline' className='flex items-center space-x-2'>
              <ArrowLeftIcon size={16} />
              <span>Back to Leads</span>
            </Button>
          </Link>
          <Button
            onClick={calculateAllScores}
            disabled={calculating}
            className='flex items-center space-x-2'
          >
            {calculating ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <RefreshIcon size={16} />
                <span>Recalculate All Scores</span>
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Score Distribution */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900'
            >
              Score Distribution
            </Typography>
            <div className='flex items-center space-x-2 text-sm text-gray-500'>
              <TrendingUpIcon size={16} />
              <span>Total Leads: {totalLeads}</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            {scoreRanges.map((range, index) => {
              const percentage =
                totalLeads > 0 ? (range.count / totalLeads) * 100 : 0;
              const isSelected = selectedRange === `${range.min}-${range.max}`;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRangeFilter(range)}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <Badge className={range.color}>
                      {range.min}-{range.max}
                    </Badge>
                    <span className='text-sm text-gray-500'>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-gray-900 mb-1'>
                    {range.count}
                  </div>
                  <div className='text-sm text-gray-600'>{range.label}</div>
                  <div className='mt-2 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='flex items-center space-x-3'>
            <Button
              variant={selectedRange === 'all' ? 'default' : 'outline'}
              onClick={() => handleRangeFilter(null)}
              className='flex items-center space-x-2'
            >
              <FilterIcon size={16} />
              <span>Show All</span>
            </Button>
          </div>
        </div>

        {/* Scoring Criteria */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900 mb-4'
          >
            Scoring Criteria
          </Typography>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Typography
                variant='h4'
                className='font-medium text-gray-900 mb-3'
              >
                Profile Completeness
              </Typography>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>• Senior title (CEO, CTO, etc.): +25 points</li>
                <li>• Company name provided: +15 points</li>
                <li>• Full name provided: +10 points</li>
              </ul>
            </div>
            <div>
              <Typography
                variant='h4'
                className='font-medium text-gray-900 mb-3'
              >
                Email Engagement
              </Typography>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>• Email open rate: up to +25 points</li>
                <li>• Email click rate: up to +25 points</li>
                <li>• Recent activity: bonus points</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900'
            >
              Leads {selectedRange !== 'all' && `(Score: ${selectedRange})`}
            </Typography>
          </div>

          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <Typography variant='p' className='mt-2 text-gray-500'>
                Loading leads...
              </Typography>
            </div>
          ) : leads.length === 0 ? (
            <div className='p-8 text-center'>
              <Typography variant='p' className='text-gray-500'>
                No leads found in the selected score range.
              </Typography>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Lead
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Company
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Score
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {leads.map(lead => (
                    <tr key={lead.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {lead.email}
                          </div>
                          {lead.title && (
                            <div className='text-xs text-gray-400'>
                              {lead.title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {lead.companyName || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {lead.priorityScore ? (
                          <Badge className={getScoreColor(lead.priorityScore)}>
                            {Math.round(lead.priorityScore)}
                          </Badge>
                        ) : (
                          <span className='text-gray-400'>Not scored</span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge className='bg-green-100 text-green-800'>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `/api/leads/${lead.id}/calculate-score`,
                                {
                                  method: 'POST',
                                }
                              );
                              if (response.ok) {
                                // Refresh the current view
                                if (selectedRange === 'all') {
                                  fetchLeads();
                                } else {
                                  const [min, max] = selectedRange
                                    .split('-')
                                    .map(Number);
                                  fetchLeads(min, max);
                                }
                                fetchScoreDistribution();
                              }
                            } catch (error) {
                              console.error(
                                'Failed to recalculate score:',
                                error
                              );
                            }
                          }}
                        >
                          Recalculate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
