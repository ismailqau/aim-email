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

interface EmailSettings {
  provider: 'SENDGRID' | 'SMTP';
  sendgridConfig?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    webhookUrl?: string;
  };
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    replyToEmail?: string;
    enableDkim: boolean;
    dkimPrivateKey?: string;
    dkimSelector?: string;
    dkimDomain?: string;
    maxConnections: number;
    maxMessages: number;
    rateLimit: number;
    connectionTimeout: number;
    socketTimeout: number;
    greetingTimeout: number;
    useStaticIp: boolean;
    staticIpAddress?: string;
    enableTls: boolean;
    requireTls: boolean;
  };
}

interface ReputationMetrics {
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
  reputationScore: number;
  warnings: string[];
  recommendations: string[];
}

export default function EmailSettingsPage() {
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(
    null
  );
  const [reputationMetrics, setReputationMetrics] =
    useState<ReputationMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<
    'provider' | 'smtp' | 'reputation' | 'testing'
  >('provider');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetchEmailSettings();
    fetchReputationMetrics();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      // TODO: Replace with actual API call
      const mockSettings: EmailSettings = {
        provider: 'SMTP',
        smtpConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          username: 'your-email@gmail.com',
          password: '',
          fromEmail: 'noreply@yourdomain.com',
          fromName: 'Your Company',
          replyToEmail: 'support@yourdomain.com',
          enableDkim: true,
          dkimSelector: 'default',
          dkimDomain: 'yourdomain.com',
          maxConnections: 5,
          maxMessages: 100,
          rateLimit: 10,
          connectionTimeout: 60000,
          socketTimeout: 60000,
          greetingTimeout: 30000,
          useStaticIp: false,
          enableTls: true,
          requireTls: false,
        },
      };
      setEmailSettings(mockSettings);
    } catch (error) {
      console.error('Failed to fetch email settings:', error);
    }
  };

  const fetchReputationMetrics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockMetrics: ReputationMetrics = {
        deliveryRate: 98.5,
        bounceRate: 1.2,
        complaintRate: 0.1,
        reputationScore: 95,
        warnings: [],
        recommendations: [
          'Configure DMARC record for better domain reputation',
          'Consider implementing email warmup for new domains',
        ],
      };
      setReputationMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch reputation metrics:', error);
    }
  };

  const handleProviderChange = (provider: 'SENDGRID' | 'SMTP') => {
    setEmailSettings(prev => (prev ? { ...prev, provider } : null));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConfiguration = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to test configuration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      setTestResult({
        success: true,
        messageId: 'test-message-123',
        deliveryTime: 1250,
        warnings: [],
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to send test email',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProviderTab = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium mb-4'>Email Provider Selection</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card
            className={`cursor-pointer border-2 ${emailSettings?.provider === 'SENDGRID' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => handleProviderChange('SENDGRID')}
          >
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>SendGrid</span>
                {emailSettings?.provider === 'SENDGRID' && (
                  <span className='text-blue-500'>✓</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                Professional email delivery service with built-in analytics and
                deliverability optimization.
              </p>
              <ul className='mt-2 text-xs text-gray-500 space-y-1'>
                <li>• Enterprise-grade deliverability</li>
                <li>• Built-in analytics and reporting</li>
                <li>• Automatic IP warming</li>
                <li>• 24/7 support</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 ${emailSettings?.provider === 'SMTP' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => handleProviderChange('SMTP')}
          >
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <span>Custom SMTP</span>
                {emailSettings?.provider === 'SMTP' && (
                  <span className='text-blue-500'>✓</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600'>
                Full control with advanced anti-blacklisting features, DKIM
                signing, and reputation monitoring.
              </p>
              <ul className='mt-2 text-xs text-gray-500 space-y-1'>
                <li>• Complete customization</li>
                <li>• Advanced anti-blacklisting</li>
                <li>• DKIM/SPF/DMARC support</li>
                <li>• Static IP configuration</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {emailSettings?.provider === 'SENDGRID' && (
        <Card>
          <CardHeader>
            <CardTitle>SendGrid Configuration</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                API Key
              </label>
              <input
                type='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='SG.your-api-key'
                value={emailSettings.sendgridConfig?.apiKey || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          sendgridConfig: {
                            ...prev.sendgridConfig!,
                            apiKey: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  From Email
                </label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='noreply@yourdomain.com'
                  value={emailSettings.sendgridConfig?.fromEmail || ''}
                  onChange={e =>
                    setEmailSettings(prev =>
                      prev
                        ? {
                            ...prev,
                            sendgridConfig: {
                              ...prev.sendgridConfig!,
                              fromEmail: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  From Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Your Company'
                  value={emailSettings.sendgridConfig?.fromName || ''}
                  onChange={e =>
                    setEmailSettings(prev =>
                      prev
                        ? {
                            ...prev,
                            sendgridConfig: {
                              ...prev.sendgridConfig!,
                              fromName: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSMTPTab = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>SMTP Server Configuration</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SMTP Host
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='smtp.gmail.com'
                value={emailSettings?.smtpConfig?.host || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            host: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Port
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='587'
                value={emailSettings?.smtpConfig?.port || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            port: parseInt(e.target.value),
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div className='flex items-center space-x-2 pt-6'>
              <input
                type='checkbox'
                id='secure'
                checked={emailSettings?.smtpConfig?.secure || false}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            secure: e.target.checked,
                          },
                        }
                      : null
                  )
                }
              />
              <label
                htmlFor='secure'
                className='text-sm font-medium text-gray-700'
              >
                SSL/TLS
              </label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Username
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='your-email@gmail.com'
                value={emailSettings?.smtpConfig?.username || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            username: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                type='password'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Your password or app password'
                value={emailSettings?.smtpConfig?.password || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            password: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                From Email
              </label>
              <input
                type='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='noreply@yourdomain.com'
                value={emailSettings?.smtpConfig?.fromEmail || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            fromEmail: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                From Name
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Your Company'
                value={emailSettings?.smtpConfig?.fromName || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            fromName: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DKIM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>DKIM Authentication</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='enableDkim'
              checked={emailSettings?.smtpConfig?.enableDkim || false}
              onChange={e =>
                setEmailSettings(prev =>
                  prev
                    ? {
                        ...prev,
                        smtpConfig: {
                          ...prev.smtpConfig!,
                          enableDkim: e.target.checked,
                        },
                      }
                    : null
                )
              }
            />
            <label
              htmlFor='enableDkim'
              className='text-sm font-medium text-gray-700'
            >
              Enable DKIM Signing
            </label>
          </div>

          {emailSettings?.smtpConfig?.enableDkim && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  DKIM Selector
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='default'
                  value={emailSettings?.smtpConfig?.dkimSelector || ''}
                  onChange={e =>
                    setEmailSettings(prev =>
                      prev
                        ? {
                            ...prev,
                            smtpConfig: {
                              ...prev.smtpConfig!,
                              dkimSelector: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  DKIM Domain
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='yourdomain.com'
                  value={emailSettings?.smtpConfig?.dkimDomain || ''}
                  onChange={e =>
                    setEmailSettings(prev =>
                      prev
                        ? {
                            ...prev,
                            smtpConfig: {
                              ...prev.smtpConfig!,
                              dkimDomain: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Max Connections
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={emailSettings?.smtpConfig?.maxConnections || 5}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            maxConnections: parseInt(e.target.value),
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Rate Limit (per minute)
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={emailSettings?.smtpConfig?.rateLimit || 10}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            rateLimit: parseInt(e.target.value),
                          },
                        }
                      : null
                  )
                }
              />
            </div>
            <div className='flex items-center space-x-2 pt-6'>
              <input
                type='checkbox'
                id='useStaticIp'
                checked={emailSettings?.smtpConfig?.useStaticIp || false}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            useStaticIp: e.target.checked,
                          },
                        }
                      : null
                  )
                }
              />
              <label
                htmlFor='useStaticIp'
                className='text-sm font-medium text-gray-700'
              >
                Use Static IP
              </label>
            </div>
          </div>

          {emailSettings?.smtpConfig?.useStaticIp && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Static IP Address
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='192.168.1.100'
                value={emailSettings?.smtpConfig?.staticIpAddress || ''}
                onChange={e =>
                  setEmailSettings(prev =>
                    prev
                      ? {
                          ...prev,
                          smtpConfig: {
                            ...prev.smtpConfig!,
                            staticIpAddress: e.target.value,
                          },
                        }
                      : null
                  )
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReputationTab = () => (
    <div className='space-y-6'>
      {reputationMetrics && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm text-gray-600'>
                  Delivery Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-green-600'>
                  {reputationMetrics.deliveryRate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm text-gray-600'>
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-orange-600'>
                  {reputationMetrics.bounceRate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm text-gray-600'>
                  Complaint Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-red-600'>
                  {reputationMetrics.complaintRate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm text-gray-600'>
                  Reputation Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-blue-600'>
                  {reputationMetrics.reputationScore}
                </p>
              </CardContent>
            </Card>
          </div>

          {reputationMetrics.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {reputationMetrics.recommendations.map((rec, index) => (
                    <li key={index} className='flex items-start space-x-2'>
                      <span className='text-blue-500 mt-1'>•</span>
                      <span className='text-sm'>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  const renderTestingTab = () => (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Test Email Address
            </label>
            <input
              type='email'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='test@example.com'
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
            />
          </div>
          <button
            onClick={handleTestConfiguration}
            disabled={loading}
            className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </CardContent>
      </Card>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            {testResult.success ? (
              <div className='space-y-2'>
                <p className='text-green-600 font-medium'>
                  ✓ Test email sent successfully!
                </p>
                <p className='text-sm text-gray-600'>
                  Message ID: {testResult.messageId}
                </p>
                <p className='text-sm text-gray-600'>
                  Delivery Time: {testResult.deliveryTime}ms
                </p>
              </div>
            ) : (
              <div>
                <p className='text-red-600 font-medium'>✗ Test failed</p>
                <p className='text-sm text-gray-600'>{testResult.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (!emailSettings) {
    return (
      <div className='flex justify-center items-center h-64'>Loading...</div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Email Settings</h1>
          <p className='text-gray-600'>
            Configure your email provider and manage deliverability
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200 mb-6'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'provider', label: 'Provider' },
              {
                id: 'smtp',
                label: 'SMTP Config',
                disabled: emailSettings.provider !== 'SMTP',
              },
              { id: 'reputation', label: 'Reputation' },
              { id: 'testing', label: 'Testing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : tab.disabled
                      ? 'border-transparent text-gray-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={tab.disabled}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='mb-6'>
          {activeTab === 'provider' && renderProviderTab()}
          {activeTab === 'smtp' && renderSMTPTab()}
          {activeTab === 'reputation' && renderReputationTab()}
          {activeTab === 'testing' && renderTestingTab()}
        </div>

        {/* Save Button */}
        {(activeTab === 'provider' || activeTab === 'smtp') && (
          <div className='flex justify-end'>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className='bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
