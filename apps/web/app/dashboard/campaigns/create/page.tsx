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

import React, { useState, useEffect } from 'react';
import {
  DashboardLayout,
  Button,
  Typography,
  Badge,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  MoveIcon,
  SaveIcon,
} from '@email-system/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface CampaignStep {
  id: string;
  templateId: string;
  template?: EmailTemplate;
  order: number;
  delayHours: number;
}

interface CampaignForm {
  name: string;
  description: string;
  steps: CampaignStep[];
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    description: '',
    steps: [],
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns/templates/list');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const addStep = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newStep: CampaignStep = {
      id: `step-${Date.now()}`,
      templateId,
      template,
      order: form.steps.length + 1,
      delayHours: form.steps.length === 0 ? 0 : 24, // First step has no delay
    };

    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const removeStep = (stepId: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps
        .filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 })),
    }));
  };

  const updateStepDelay = (stepId: string, delayHours: number) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, delayHours } : step
      ),
    }));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = form.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (newIndex < 0 || newIndex >= form.steps.length) return;

    const newSteps = [...form.steps];
    [newSteps[stepIndex], newSteps[newIndex]] = [
      newSteps[newIndex],
      newSteps[stepIndex],
    ];

    // Update order numbers
    newSteps.forEach((step, index) => {
      step.order = index + 1;
    });

    setForm(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    if (form.steps.length === 0) {
      alert('Please add at least one email step');
      return;
    }

    setSaving(true);
    try {
      const campaignData = {
        name: form.name,
        description: form.description,
        templateIds: form.steps.map(step => step.templateId),
        settings: {
          stepDelays: form.steps.map(step => step.delayHours),
        },
      };

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        router.push('/dashboard/campaigns');
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDelayText = (hours: number) => {
    if (hours === 0) return 'Immediate';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${days}d ${remainingHours}h`;
  };

  return (
    <DashboardLayout
      title='Create Campaign'
      subtitle='Build your email marketing campaign'
      actions={
        <div className='flex space-x-3'>
          <Link href='/dashboard/campaigns'>
            <Button variant='outline' className='flex items-center space-x-2'>
              <ArrowLeftIcon size={16} />
              <span>Back to Campaigns</span>
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || form.steps.length === 0}
            className='flex items-center space-x-2'
          >
            {saving ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SaveIcon size={16} />
                <span>Create Campaign</span>
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Campaign Details */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900 mb-4'
          >
            Campaign Details
          </Typography>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Campaign Name *
              </label>
              <input
                type='text'
                value={form.name}
                onChange={e =>
                  setForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder='Enter campaign name'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <input
                type='text'
                value={form.description}
                onChange={e =>
                  setForm(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder='Brief description of the campaign'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Email Templates */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900 mb-4'
            >
              Email Templates
            </Typography>
            {loading ? (
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className='animate-pulse'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-full mb-3'></div>
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className='text-center py-8'>
                <Typography variant='p' className='text-gray-500 mb-4'>
                  No templates available
                </Typography>
                <Link href='/dashboard/campaigns/templates'>
                  <Button size='sm'>Create Template</Button>
                </Link>
              </div>
            ) : (
              <div className='space-y-3 max-h-96 overflow-y-auto'>
                {templates.map(template => (
                  <div
                    key={template.id}
                    className='border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors'
                    onClick={() => addStep(template.id)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <Typography
                          variant='small'
                          className='font-medium text-gray-900'
                        >
                          {template.name}
                        </Typography>
                        <Typography
                          variant='small'
                          className='text-gray-600 text-xs mt-1'
                        >
                          {template.subject}
                        </Typography>
                      </div>
                      <Button size='sm' variant='ghost' className='ml-2'>
                        <PlusIcon size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Flow */}
          <div className='lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900 mb-4'
            >
              Campaign Flow ({form.steps.length} steps)
            </Typography>

            {form.steps.length === 0 ? (
              <div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
                <Typography variant='p' className='text-gray-500 mb-2'>
                  No email steps added yet
                </Typography>
                <Typography variant='small' className='text-gray-400'>
                  Select templates from the left to build your campaign flow
                </Typography>
              </div>
            ) : (
              <div className='space-y-4'>
                {form.steps.map((step, index) => (
                  <div key={step.id} className='relative'>
                    {/* Step Card */}
                    <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start space-x-3'>
                          <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                            {step.order}
                          </div>
                          <div className='flex-1'>
                            <Typography
                              variant='small'
                              className='font-medium text-gray-900'
                            >
                              {step.template?.name}
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-gray-600 text-xs'
                            >
                              {step.template?.subject}
                            </Typography>
                            {index > 0 && (
                              <div className='mt-2'>
                                <label className='block text-xs text-gray-500 mb-1'>
                                  Delay after previous step
                                </label>
                                <div className='flex items-center space-x-2'>
                                  <select
                                    value={step.delayHours}
                                    onChange={e =>
                                      updateStepDelay(
                                        step.id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className='text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500'
                                  >
                                    <option value={0}>Immediate</option>
                                    <option value={1}>1 hour</option>
                                    <option value={6}>6 hours</option>
                                    <option value={12}>12 hours</option>
                                    <option value={24}>1 day</option>
                                    <option value={48}>2 days</option>
                                    <option value={72}>3 days</option>
                                    <option value={168}>1 week</option>
                                  </select>
                                  <Badge className='bg-blue-100 text-blue-800 text-xs'>
                                    {getDelayText(step.delayHours)}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                            className='p-1'
                          >
                            <MoveIcon size={14} className='rotate-180' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === form.steps.length - 1}
                            className='p-1'
                          >
                            <MoveIcon size={14} />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => removeStep(step.id)}
                            className='p-1 text-red-600 hover:text-red-700'
                          >
                            <TrashIcon size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Arrow to next step */}
                    {index < form.steps.length - 1 && (
                      <div className='flex justify-center py-2'>
                        <div className='w-0.5 h-6 bg-gray-300'></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Summary */}
        {form.steps.length > 0 && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-blue-900 mb-3'
            >
              Campaign Summary
            </Typography>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800'>
              <div>
                <div className='text-2xl font-bold'>{form.steps.length}</div>
                <div className='text-sm'>Email Steps</div>
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {Math.max(...form.steps.map(s => s.delayHours))}
                </div>
                <div className='text-sm'>Max Delay (hours)</div>
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {form.steps.reduce((sum, s) => sum + s.delayHours, 0)}
                </div>
                <div className='text-sm'>Total Duration (hours)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
