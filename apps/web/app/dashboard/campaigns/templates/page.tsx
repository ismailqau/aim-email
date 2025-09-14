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
  EditIcon,
  TrashIcon,
  SearchIcon,
  ArrowLeftIcon,
  EyeIcon,
} from '@email-system/ui';
import Link from 'next/link';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables?: any;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplatesResponse {
  data: EmailTemplate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/campaigns/templates/list?${params}`);
      if (response.ok) {
        const data: TemplatesResponse = await response.json();
        setTemplates(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/campaigns/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <DashboardLayout
      title='Email Templates'
      subtitle='Manage your email templates'
      actions={
        <div className='flex space-x-3'>
          <Link href='/dashboard/campaigns'>
            <Button variant='outline' className='flex items-center space-x-2'>
              <ArrowLeftIcon size={16} />
              <span>Back to Campaigns</span>
            </Button>
          </Link>
          <Button
            onClick={() => setShowCreateModal(true)}
            className='flex items-center space-x-2'
          >
            <PlusIcon size={16} />
            <span>Create Template</span>
          </Button>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Search */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='relative'>
            <SearchIcon
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search templates by name or subject...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse'
              >
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='h-3 bg-gray-200 rounded w-full mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-2/3 mb-4'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-gray-200 rounded w-full'></div>
                  <div className='h-3 bg-gray-200 rounded w-4/5'></div>
                  <div className='h-3 bg-gray-200 rounded w-3/5'></div>
                </div>
                <div className='flex justify-between mt-4'>
                  <div className='h-8 bg-gray-200 rounded w-16'></div>
                  <div className='h-8 bg-gray-200 rounded w-20'></div>
                </div>
              </div>
            ))
          ) : templates.length === 0 ? (
            <div className='col-span-full'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
                <Typography variant='p' className='text-gray-500 mb-4'>
                  {searchTerm
                    ? 'No templates found matching your search.'
                    : 'No templates created yet.'}
                </Typography>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className='flex items-center space-x-2 mx-auto'
                >
                  <PlusIcon size={16} />
                  <span>Create Your First Template</span>
                </Button>
              </div>
            </div>
          ) : (
            templates.map(template => (
              <div
                key={template.id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
              >
                {/* Template Header */}
                <div className='flex items-start justify-between mb-3'>
                  <Typography
                    variant='h4'
                    className='font-semibold text-gray-900 text-sm'
                  >
                    {template.name}
                  </Typography>
                  {template.aiGenerated && (
                    <Badge className='bg-purple-100 text-purple-800 text-xs'>
                      AI
                    </Badge>
                  )}
                </div>

                {/* Subject */}
                <Typography
                  variant='small'
                  className='text-gray-600 mb-3 font-medium'
                >
                  Subject: {template.subject}
                </Typography>

                {/* Content Preview */}
                <div className='mb-4'>
                  <Typography
                    variant='small'
                    className='text-gray-500 text-xs leading-relaxed'
                  >
                    {truncateContent(template.content.replace(/<[^>]*>/g, ''))}
                  </Typography>
                </div>

                {/* Variables */}
                {template.variables &&
                  Object.keys(template.variables).length > 0 && (
                    <div className='mb-4'>
                      <Typography
                        variant='small'
                        className='text-gray-500 text-xs mb-1'
                      >
                        Variables:
                      </Typography>
                      <div className='flex flex-wrap gap-1'>
                        {Object.keys(template.variables)
                          .slice(0, 3)
                          .map(variable => (
                            <Badge
                              key={variable}
                              className='bg-gray-100 text-gray-700 text-xs'
                            >
                              {variable}
                            </Badge>
                          ))}
                        {Object.keys(template.variables).length > 3 && (
                          <Badge className='bg-gray-100 text-gray-700 text-xs'>
                            +{Object.keys(template.variables).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className='flex justify-between items-center'>
                  <div className='flex space-x-1'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => setPreviewTemplate(template)}
                      className='p-1'
                    >
                      <EyeIcon size={14} />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => setEditingTemplate(template)}
                      className='p-1'
                    >
                      <EditIcon size={14} />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDeleteTemplate(template.id)}
                      className='p-1 text-red-600 hover:text-red-700'
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                  <Typography variant='small' className='text-gray-400 text-xs'>
                    {new Date(template.updatedAt).toLocaleDateString()}
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
                {pagination.total} templates
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

      {/* Create/Edit Template Modal */}
      {(showCreateModal || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
          onSave={() => {
            fetchTemplates();
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </DashboardLayout>
  );
}

// Template Modal Component
function TemplateModal({
  template,
  onClose,
  onSave,
}: {
  template: EmailTemplate | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const url = template
        ? `/api/campaigns/templates/${template.id}`
        : '/api/campaigns/templates';
      const method = template ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        onSave();
      } else {
        throw new Error('Failed to save template');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900'
          >
            {template ? 'Edit Template' : 'Create Template'}
          </Typography>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Template Name *
              </label>
              <input
                type='text'
                value={form.name}
                onChange={e =>
                  setForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder='Enter template name'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Subject *
              </label>
              <input
                type='text'
                value={form.subject}
                onChange={e =>
                  setForm(prev => ({ ...prev, subject: e.target.value }))
                }
                placeholder='Enter email subject'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Content *
              </label>
              <textarea
                value={form.content}
                onChange={e =>
                  setForm(prev => ({ ...prev, content: e.target.value }))
                }
                placeholder='Enter email content (HTML supported)'
                rows={12}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <Typography variant='small' className='text-gray-500 mt-1'>
                You can use variables like {'{'}firstName{'}'}, {'{'}lastName
                {'}'}, {'{'}companyName{'}'}
              </Typography>
            </div>
          </div>
        </div>

        <div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : template ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Preview Modal Component
function PreviewModal({
  template,
  onClose,
}: {
  template: EmailTemplate;
  onClose: () => void;
}) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
        <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900'
          >
            Preview: {template.name}
          </Typography>
          <Button variant='ghost' onClick={onClose}>
            ×
          </Button>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          <div className='space-y-4'>
            <div>
              <Typography
                variant='small'
                className='font-medium text-gray-700 mb-1'
              >
                Subject:
              </Typography>
              <Typography variant='p' className='text-gray-900'>
                {template.subject}
              </Typography>
            </div>

            <div>
              <Typography
                variant='small'
                className='font-medium text-gray-700 mb-2'
              >
                Content:
              </Typography>
              <div
                className='prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 bg-gray-50'
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
