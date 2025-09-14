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
  SaveIcon,
  TestIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
} from '@email-system/ui';
import Link from 'next/link';

interface EmailSettings {
  id?: string;
  provider: 'SENDGRID' | 'SMTP';
  isActive: boolean;
  sendgridConfig?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    webhookUrl?: string;
  };
  smtpConfig?: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    enableTls: boolean;
    requireTls: boolean;
  };
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'SENDGRID',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/email');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/email', {
        method: settings.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        alert('Email settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save email settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/emails/test-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: settings.provider,
          config:
            settings.provider === 'SENDGRID'
              ? settings.sendgridConfig
              : settings.smtpConfig,
        }),
      });

      const result = await response.json();
      setTestResult({
        success: response.ok,
        message:
          result.message || (response.ok ? 'Test successful!' : 'Test failed'),
      });
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        success: false,
        message: 'Failed to test email configuration',
      });
    } finally {
      setTesting(false);
    }
  };

  const updateSendGridConfig = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      sendgridConfig: {
        ...prev.sendgridConfig,
        [field]: value,
      } as any,
    }));
  };

  const updateSmtpConfig = (
    field: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      smtpConfig: {
        ...prev.smtpConfig,
        [field]: value,
      } as any,
    }));
  };

  if (loading) {
    return (
      <DashboardLayout
        title='Email Settings'
        subtitle='Configure your email delivery settings'
      >
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title='Email Settings'
      subtitle='Configure your email delivery settings'
      actions={
        <div className='flex space-x-3'>
          <Link href='/dashboard/settings'>
            <Button variant='outline' className='flex items-center space-x-2'>
              <ArrowLeftIcon size={16} />
              <span>Back to Settings</span>
            </Button>
          </Link>
          <Button
            onClick={handleTest}
            disabled={testing}
            variant='outline'
            className='flex items-center space-x-2'
          >
            {testing ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600'></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <TestIcon size={16} />
                <span>Test Configuration</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
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
                <span>Save Settings</span>
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Test Result */}
        {testResult && (
          <div
            className={`p-4 rounded-lg border ${
              testResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className='flex items-center space-x-2'>
              {testResult.success ? (
                <CheckIcon size={20} className='text-green-600' />
              ) : (
                <XIcon size={20} className='text-red-600' />
              )}
              <Typography variant='p' className='font-medium'>
                {testResult.message}
              </Typography>
            </div>
          </div>
        )}

        {/* Provider Selection */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900 mb-4'
          >
            Email Provider
          </Typography>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                settings.provider === 'SENDGRID'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() =>
                setSettings(prev => ({ ...prev, provider: 'SENDGRID' }))
              }
            >
              <div className='flex items-center justify-between mb-2'>
                <Typography variant='h4' className='font-medium text-gray-900'>
                  SendGrid
                </Typography>
                <Badge className='bg-green-100 text-green-800'>
                  Recommended
                </Badge>
              </div>
              <Typography variant='small' className='text-gray-600'>
                Reliable email delivery service with advanced analytics and high
                deliverability rates.
              </Typography>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                settings.provider === 'SMTP'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() =>
                setSettings(prev => ({ ...prev, provider: 'SMTP' }))
              }
            >
              <div className='flex items-center justify-between mb-2'>
                <Typography variant='h4' className='font-medium text-gray-900'>
                  Custom SMTP
                </Typography>
                <Badge className='bg-blue-100 text-blue-800'>Advanced</Badge>
              </div>
              <Typography variant='small' className='text-gray-600'>
                Use your own SMTP server or third-party SMTP service for email
                delivery.
              </Typography>
            </div>
          </div>
        </div>

        {/* SendGrid Configuration */}
        {settings.provider === 'SENDGRID' && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900 mb-4'
            >
              SendGrid Configuration
            </Typography>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    API Key *
                  </label>
                  <input
                    type='password'
                    value={settings.sendgridConfig?.apiKey || ''}
                    onChange={e =>
                      updateSendGridConfig('apiKey', e.target.value)
                    }
                    placeholder='SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Webhook URL
                  </label>
                  <input
                    type='url'
                    value={settings.sendgridConfig?.webhookUrl || ''}
                    onChange={e =>
                      updateSendGridConfig('webhookUrl', e.target.value)
                    }
                    placeholder='https://yourdomain.com/api/webhooks/sendgrid'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From Email *
                  </label>
                  <input
                    type='email'
                    value={settings.sendgridConfig?.fromEmail || ''}
                    onChange={e =>
                      updateSendGridConfig('fromEmail', e.target.value)
                    }
                    placeholder='noreply@yourdomain.com'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From Name *
                  </label>
                  <input
                    type='text'
                    value={settings.sendgridConfig?.fromName || ''}
                    onChange={e =>
                      updateSendGridConfig('fromName', e.target.value)
                    }
                    placeholder='Your Company Name'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SMTP Configuration */}
        {settings.provider === 'SMTP' && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900 mb-4'
            >
              SMTP Configuration
            </Typography>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    SMTP Host *
                  </label>
                  <input
                    type='text'
                    value={settings.smtpConfig?.host || ''}
                    onChange={e => updateSmtpConfig('host', e.target.value)}
                    placeholder='smtp.gmail.com'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Port *
                  </label>
                  <input
                    type='number'
                    value={settings.smtpConfig?.port || 587}
                    onChange={e =>
                      updateSmtpConfig('port', parseInt(e.target.value))
                    }
                    placeholder='587'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Username *
                  </label>
                  <input
                    type='text'
                    value={settings.smtpConfig?.username || ''}
                    onChange={e => updateSmtpConfig('username', e.target.value)}
                    placeholder='your-email@gmail.com'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Password *
                  </label>
                  <input
                    type='password'
                    value={settings.smtpConfig?.password || ''}
                    onChange={e => updateSmtpConfig('password', e.target.value)}
                    placeholder='Your app password'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From Email *
                  </label>
                  <input
                    type='email'
                    value={settings.smtpConfig?.fromEmail || ''}
                    onChange={e =>
                      updateSmtpConfig('fromEmail', e.target.value)
                    }
                    placeholder='noreply@yourdomain.com'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    From Name *
                  </label>
                  <input
                    type='text'
                    value={settings.smtpConfig?.fromName || ''}
                    onChange={e => updateSmtpConfig('fromName', e.target.value)}
                    placeholder='Your Company Name'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='enableTls'
                    checked={settings.smtpConfig?.enableTls || false}
                    onChange={e =>
                      updateSmtpConfig('enableTls', e.target.checked)
                    }
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='enableTls'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Enable TLS encryption
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='requireTls'
                    checked={settings.smtpConfig?.requireTls || false}
                    onChange={e =>
                      updateSmtpConfig('requireTls', e.target.checked)
                    }
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='requireTls'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Require TLS (recommended)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-900 mb-4'
          >
            Status
          </Typography>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='p' className='text-gray-900 font-medium'>
                Email Service Status
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Enable or disable email delivery for your campaigns
              </Typography>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='isActive'
                checked={settings.isActive}
                onChange={e =>
                  setSettings(prev => ({ ...prev, isActive: e.target.checked }))
                }
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label htmlFor='isActive' className='ml-2'>
                <Badge
                  className={
                    settings.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {settings.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </label>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-blue-900 mb-3'
          >
            Need Help?
          </Typography>
          <div className='space-y-2 text-blue-800'>
            <p>
              • <strong>SendGrid:</strong> Sign up at sendgrid.com and create an
              API key with full access
            </p>
            <p>
              • <strong>Gmail SMTP:</strong> Use port 587 with TLS enabled and
              an app-specific password
            </p>
            <p>
              • <strong>Outlook SMTP:</strong> Use smtp-mail.outlook.com on port
              587
            </p>
            <p>
              • <strong>Custom SMTP:</strong> Contact your hosting provider for
              SMTP settings
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
