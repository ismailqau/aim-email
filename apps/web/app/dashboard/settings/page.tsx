/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

'use client';

import { useState } from 'react';
import {
  DashboardLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Typography,
} from '@email-system/ui';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    autoBackup: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='mb-8'>
          <Typography
            variant='h1'
            className='text-3xl font-bold text-gray-900 mb-2'
          >
            Settings
          </Typography>
          <Typography variant='p' className='text-gray-600'>
            Manage your account preferences and application settings
          </Typography>
        </div>

        {/* Settings Sections */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='small' className='font-medium'>
                    Email Notifications
                  </Typography>
                  <Typography variant='small' className='text-gray-500 text-sm'>
                    Receive email updates about your campaigns
                  </Typography>
                </div>
                <Button
                  variant={settings.emailNotifications ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    handleSettingChange(
                      'emailNotifications',
                      !settings.emailNotifications
                    )
                  }
                >
                  {settings.emailNotifications ? 'On' : 'Off'}
                </Button>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='small' className='font-medium'>
                    Push Notifications
                  </Typography>
                  <Typography variant='small' className='text-gray-500 text-sm'>
                    Get push notifications on your device
                  </Typography>
                </div>
                <Button
                  variant={settings.pushNotifications ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    handleSettingChange(
                      'pushNotifications',
                      !settings.pushNotifications
                    )
                  }
                >
                  {settings.pushNotifications ? 'On' : 'Off'}
                </Button>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='small' className='font-medium'>
                    Weekly Reports
                  </Typography>
                  <Typography variant='small' className='text-gray-500 text-sm'>
                    Receive weekly performance summaries
                  </Typography>
                </div>
                <Button
                  variant={settings.weeklyReports ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    handleSettingChange(
                      'weeklyReports',
                      !settings.weeklyReports
                    )
                  }
                >
                  {settings.weeklyReports ? 'On' : 'Off'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='small' className='font-medium'>
                    Auto Backup
                  </Typography>
                  <Typography variant='small' className='text-gray-500 text-sm'>
                    Automatically backup your data
                  </Typography>
                </div>
                <Button
                  variant={settings.autoBackup ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    handleSettingChange('autoBackup', !settings.autoBackup)
                  }
                >
                  {settings.autoBackup ? 'On' : 'Off'}
                </Button>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='small' className='font-medium'>
                    Dark Mode
                  </Typography>
                  <Typography variant='small' className='text-gray-500 text-sm'>
                    Switch to dark theme
                  </Typography>
                </div>
                <Button
                  variant={settings.darkMode ? 'default' : 'outline'}
                  size='sm'
                  onClick={() =>
                    handleSettingChange('darkMode', !settings.darkMode)
                  }
                >
                  {settings.darkMode ? 'On' : 'Off'}
                </Button>
              </div>

              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Language
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={settings.language}
                  onChange={e =>
                    handleSettingChange('language', e.target.value)
                  }
                >
                  <option value='en'>English</option>
                  <option value='es'>Spanish</option>
                  <option value='fr'>French</option>
                  <option value='de'>German</option>
                </select>
              </div>

              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Timezone
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={settings.timezone}
                  onChange={e =>
                    handleSettingChange('timezone', e.target.value)
                  }
                >
                  <option value='UTC'>UTC</option>
                  <option value='EST'>Eastern Time</option>
                  <option value='PST'>Pacific Time</option>
                  <option value='GMT'>Greenwich Mean Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button className='w-full' variant='outline'>
                Change Password
              </Button>
              <Button className='w-full' variant='outline'>
                Two-Factor Authentication
              </Button>
              <Button className='w-full' variant='outline'>
                API Keys
              </Button>
              <Button className='w-full' variant='destructive'>
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button className='w-full' variant='outline'>
                Export Data
              </Button>
              <Button className='w-full' variant='outline'>
                Privacy Settings
              </Button>
              <Button className='w-full' variant='outline'>
                Data Retention
              </Button>
              <Button className='w-full' variant='outline'>
                Cookie Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className='flex justify-end pt-6'>
          <Button className='px-8'>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
