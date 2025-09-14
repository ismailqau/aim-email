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

import React, { useState } from 'react';
import {
  DashboardLayout,
  Button,
  Typography,
  Badge,
  ConnectIcon,
  DisconnectIcon,
  SettingsIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
  RefreshIcon,
} from '@email-system/ui';
import Link from 'next/link';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'CRM' | 'Analytics' | 'Storage' | 'Communication' | 'Marketing';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config?: any;
  features: string[];
  setupUrl?: string;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      description: 'Sync leads and contacts with HubSpot CRM',
      category: 'CRM',
      status: 'disconnected',
      features: ['Lead sync', 'Contact management', 'Deal tracking'],
      setupUrl: 'https://app.hubspot.com/oauth/authorize',
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect with Salesforce CRM for lead management',
      category: 'CRM',
      status: 'disconnected',
      features: ['Lead import/export', 'Opportunity tracking', 'Account sync'],
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track email campaign performance in Google Analytics',
      category: 'Analytics',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      features: ['Campaign tracking', 'Conversion analytics', 'UTM parameters'],
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps through Zapier automation',
      category: 'Marketing',
      status: 'connected',
      lastSync: '2024-01-15T09:15:00Z',
      features: ['Workflow automation', 'Data sync', 'Trigger actions'],
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      category: 'Communication',
      status: 'error',
      features: [
        'Campaign notifications',
        'Lead alerts',
        'Performance reports',
      ],
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Store and sync campaign assets with Google Drive',
      category: 'Storage',
      status: 'disconnected',
      features: ['File storage', 'Asset management', 'Backup sync'],
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: 'webhook-1',
      name: 'Lead Created Webhook',
      url: 'https://your-app.com/webhooks/lead-created',
      events: ['lead.created', 'lead.updated'],
      isActive: true,
      lastTriggered: '2024-01-15T10:30:00Z',
    },
    {
      id: 'webhook-2',
      name: 'Campaign Events',
      url: 'https://your-app.com/webhooks/campaign-events',
      events: ['campaign.started', 'campaign.completed', 'email.sent'],
      isActive: false,
    },
  ]);

  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(
    null
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CRM':
        return 'bg-blue-100 text-blue-800';
      case 'Analytics':
        return 'bg-purple-100 text-purple-800';
      case 'Storage':
        return 'bg-yellow-100 text-yellow-800';
      case 'Communication':
        return 'bg-green-100 text-green-800';
      case 'Marketing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnect = async (integrationId: string) => {
    // Simulate connection process
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              status: 'connected' as const,
              lastSync: new Date().toISOString(),
            }
          : integration
      )
    );
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?'))
      return;

    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              status: 'disconnected' as const,
              lastSync: undefined,
            }
          : integration
      )
    );
  };

  const handleSync = async (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, lastSync: new Date().toISOString() }
          : integration
      )
    );
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev =>
      prev.map(webhook =>
        webhook.id === webhookId
          ? { ...webhook, isActive: !webhook.isActive }
          : webhook
      )
    );
  };

  const deleteWebhook = (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
  };

  return (
    <DashboardLayout
      title='Integrations'
      subtitle='Connect with third-party services and manage webhooks'
      actions={
        <Link href='/dashboard/settings'>
          <Button variant='outline' className='flex items-center space-x-2'>
            <ArrowLeftIcon size={16} />
            <span>Back to Settings</span>
          </Button>
        </Link>
      }
    >
      <div className='space-y-8'>
        {/* Available Integrations */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900 mb-6'
          >
            Available Integrations
          </Typography>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {integrations.map(integration => (
              <div
                key={integration.id}
                className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
              >
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <Typography
                      variant='h4'
                      className='font-semibold text-gray-900 mb-1'
                    >
                      {integration.name}
                    </Typography>
                    <Badge className={getCategoryColor(integration.category)}>
                      {integration.category}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status === 'connected' ? (
                      <CheckIcon size={12} className='mr-1' />
                    ) : integration.status === 'error' ? (
                      <XIcon size={12} className='mr-1' />
                    ) : null}
                    {integration.status}
                  </Badge>
                </div>

                {/* Description */}
                <Typography variant='small' className='text-gray-600 mb-4'>
                  {integration.description}
                </Typography>

                {/* Features */}
                <div className='mb-4'>
                  <Typography variant='small' className='text-gray-500 mb-2'>
                    Features:
                  </Typography>
                  <div className='space-y-1'>
                    {integration.features.map((feature, index) => (
                      <div
                        key={index}
                        className='flex items-center text-xs text-gray-600'
                      >
                        <div className='w-1 h-1 bg-gray-400 rounded-full mr-2'></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Sync */}
                {integration.lastSync && (
                  <Typography variant='small' className='text-gray-400 mb-4'>
                    Last sync: {new Date(integration.lastSync).toLocaleString()}
                  </Typography>
                )}

                {/* Actions */}
                <div className='flex space-x-2'>
                  {integration.status === 'connected' ? (
                    <>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleSync(integration.id)}
                        className='flex items-center space-x-1 flex-1'
                      >
                        <RefreshIcon size={14} />
                        <span>Sync</span>
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleDisconnect(integration.id)}
                        className='flex items-center space-x-1 text-red-600 hover:text-red-700'
                      >
                        <DisconnectIcon size={14} />
                        <span>Disconnect</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      size='sm'
                      onClick={() => handleConnect(integration.id)}
                      className='flex items-center space-x-1 w-full'
                    >
                      <ConnectIcon size={14} />
                      <span>Connect</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <Typography
                variant='h3'
                className='text-lg font-semibold text-gray-900'
              >
                Webhook Endpoints
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Configure webhooks to receive real-time notifications
              </Typography>
            </div>
            <Button
              onClick={() => setShowWebhookModal(true)}
              className='flex items-center space-x-2'
            >
              <ConnectIcon size={16} />
              <span>Add Webhook</span>
            </Button>
          </div>

          {webhooks.length === 0 ? (
            <div className='text-center py-8'>
              <Typography variant='p' className='text-gray-500 mb-4'>
                No webhooks configured yet
              </Typography>
              <Button
                onClick={() => setShowWebhookModal(true)}
                variant='outline'
              >
                Create Your First Webhook
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  className='border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-3 mb-2'>
                        <Typography
                          variant='h4'
                          className='font-medium text-gray-900'
                        >
                          {webhook.name}
                        </Typography>
                        <Badge
                          className={
                            webhook.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <Typography
                        variant='small'
                        className='text-gray-600 mb-2'
                      >
                        {webhook.url}
                      </Typography>
                      <div className='flex flex-wrap gap-1 mb-2'>
                        {webhook.events.map(event => (
                          <Badge
                            key={event}
                            className='bg-blue-100 text-blue-800 text-xs'
                          >
                            {event}
                          </Badge>
                        ))}
                      </div>
                      {webhook.lastTriggered && (
                        <Typography variant='small' className='text-gray-400'>
                          Last triggered:{' '}
                          {new Date(webhook.lastTriggered).toLocaleString()}
                        </Typography>
                      )}
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => toggleWebhook(webhook.id)}
                      >
                        {webhook.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => {
                          setEditingWebhook(webhook);
                          setShowWebhookModal(true);
                        }}
                      >
                        <SettingsIcon size={14} />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => deleteWebhook(webhook.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <XIcon size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Information */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-blue-900 mb-3'
          >
            API Information
          </Typography>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Typography
                variant='h4'
                className='font-medium text-blue-900 mb-2'
              >
                Available Webhook Events
              </Typography>
              <ul className='space-y-1 text-blue-800 text-sm'>
                <li>• lead.created - New lead added</li>
                <li>• lead.updated - Lead information changed</li>
                <li>• campaign.started - Campaign execution began</li>
                <li>• campaign.completed - Campaign finished</li>
                <li>• email.sent - Email successfully sent</li>
                <li>• email.opened - Email opened by recipient</li>
                <li>• email.clicked - Link clicked in email</li>
              </ul>
            </div>
            <div>
              <Typography
                variant='h4'
                className='font-medium text-blue-900 mb-2'
              >
                API Endpoints
              </Typography>
              <ul className='space-y-1 text-blue-800 text-sm'>
                <li>
                  • <code>GET /api/leads</code> - List leads
                </li>
                <li>
                  • <code>POST /api/leads</code> - Create lead
                </li>
                <li>
                  • <code>GET /api/campaigns</code> - List campaigns
                </li>
                <li>
                  • <code>POST /api/campaigns</code> - Create campaign
                </li>
                <li>
                  • <code>GET /api/analytics/dashboard</code> - Get metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Modal */}
      {showWebhookModal && (
        <WebhookModal
          webhook={editingWebhook}
          onClose={() => {
            setShowWebhookModal(false);
            setEditingWebhook(null);
          }}
          onSave={webhook => {
            if (editingWebhook) {
              setWebhooks(prev =>
                prev.map(w => (w.id === webhook.id ? webhook : w))
              );
            } else {
              setWebhooks(prev => [
                ...prev,
                { ...webhook, id: `webhook-${Date.now()}` },
              ]);
            }
            setShowWebhookModal(false);
            setEditingWebhook(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

// Webhook Modal Component
function WebhookModal({
  webhook,
  onClose,
  onSave,
}: {
  webhook: WebhookEndpoint | null;
  onClose: () => void;
  onSave: (webhook: WebhookEndpoint) => void;
}) {
  const [form, setForm] = useState({
    name: webhook?.name || '',
    url: webhook?.url || '',
    events: webhook?.events || [],
    isActive: webhook?.isActive ?? true,
  });

  const availableEvents = [
    'lead.created',
    'lead.updated',
    'campaign.started',
    'campaign.completed',
    'email.sent',
    'email.opened',
    'email.clicked',
  ];

  const toggleEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.url.trim() || form.events.length === 0) {
      alert('Please fill in all required fields and select at least one event');
      return;
    }

    onSave({
      id: webhook?.id || '',
      name: form.name,
      url: form.url,
      events: form.events,
      isActive: form.isActive,
      lastTriggered: webhook?.lastTriggered,
    });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
        <div className='p-6 border-b border-gray-200'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900'
          >
            {webhook ? 'Edit Webhook' : 'Add Webhook'}
          </Typography>
        </div>

        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Webhook Name *
            </label>
            <input
              type='text'
              value={form.name}
              onChange={e =>
                setForm(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder='Enter webhook name'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Webhook URL *
            </label>
            <input
              type='url'
              value={form.url}
              onChange={e =>
                setForm(prev => ({ ...prev, url: e.target.value }))
              }
              placeholder='https://your-app.com/webhook'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Events *
            </label>
            <div className='space-y-2 max-h-32 overflow-y-auto'>
              {availableEvents.map(event => (
                <div key={event} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={event}
                    checked={form.events.includes(event)}
                    onChange={() => toggleEvent(event)}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label htmlFor={event} className='ml-2 text-sm text-gray-700'>
                    {event}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isActive'
              checked={form.isActive}
              onChange={e =>
                setForm(prev => ({ ...prev, isActive: e.target.checked }))
              }
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='isActive' className='ml-2 text-sm text-gray-700'>
              Active
            </label>
          </div>
        </div>

        <div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{webhook ? 'Update' : 'Create'}</Button>
        </div>
      </div>
    </div>
  );
}
