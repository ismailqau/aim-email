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
import { Sidebar } from './sidebar';
import { Button } from '../atoms/button';
import { Typography } from '../atoms/typography';
import { Badge } from '../atoms/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { NotificationIcon, MenuIcon, ChevronDownIcon } from '../icons';

// Header Icons
const SearchIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    className='w-5 h-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    />
  </svg>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title = 'Dashboard',
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header
          className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'
          role='banner'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div>
                <Typography
                  variant='h4'
                  className='font-semibold text-gray-900 dark:text-white'
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant='small' className='text-sm'>
                    {subtitle}
                  </Typography>
                )}
              </div>
            </div>

            <div
              className='flex items-center space-x-4'
              role='toolbar'
              aria-label='User actions'
            >
              {/* Search */}
              <div className='relative hidden md:block'>
                <label htmlFor='global-search' className='sr-only'>
                  Search dashboard
                </label>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <SearchIcon />
                </div>
                <input
                  id='global-search'
                  type='text'
                  placeholder='Search dashboard...'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-400 focus:shadow-md'
                  aria-label='Search dashboard'
                />
              </div>

              {/* Quick Actions */}
              <Button
                variant='ghost'
                size='sm'
                className='hover:bg-gray-100 transition-all duration-200 hover:scale-105'
                aria-label='Quick actions menu'
              >
                <MenuIcon
                  size={20}
                  className='text-gray-600'
                  aria-hidden='true'
                />
              </Button>

              {/* Messages */}
              <Button
                variant='ghost'
                size='sm'
                className='relative hover:bg-gray-100 transition-all duration-200 hover:scale-105'
                aria-label='Messages (1 unread)'
              >
                <MessageIcon />
                <Badge
                  className='absolute -top-1 -right-1 w-2 h-2 p-0 bg-blue-500 animate-pulse'
                  aria-label='1 unread message'
                />
              </Button>

              {/* Notifications */}
              <div className='relative'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowNotifications(!showNotifications)}
                  className='relative hover:bg-gray-100 transition-all duration-200 hover:scale-105'
                  aria-label='Notifications (3 unread)'
                  aria-expanded={showNotifications}
                  aria-haspopup='true'
                >
                  <NotificationIcon
                    size={20}
                    className='text-gray-600'
                    aria-hidden='true'
                  />
                  <Badge
                    className='absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 animate-pulse'
                    aria-label='3 unread notifications'
                  />
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center justify-between'>
                        <Typography variant='h4'>Notifications</Typography>
                        <Badge variant='secondary'>3 new</Badge>
                      </div>
                    </div>
                    <div className='max-h-96 overflow-y-auto'>
                      {/* Notification Items */}
                      <div className='p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                        <div className='flex items-start space-x-3'>
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                          <div className='flex-1'>
                            <Typography variant='small' className='font-medium'>
                              New campaign performance report
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              Your Q4 Outreach campaign has achieved 28% open
                              rate
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              2 minutes ago
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                        <div className='flex items-start space-x-3'>
                          <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                          <div className='flex-1'>
                            <Typography variant='small' className='font-medium'>
                              150 new leads imported
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              Successfully imported from LinkedIn campaign
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              1 hour ago
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700'>
                        <div className='flex items-start space-x-3'>
                          <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2'></div>
                          <div className='flex-1'>
                            <Typography variant='small' className='font-medium'>
                              Email delivery warning
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              Some emails in your campaign are bouncing
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-xs mt-1'
                            >
                              3 hours ago
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                      <Button variant='ghost' className='w-full text-sm'>
                        View all notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div
                className='flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group'
                role='button'
                tabIndex={0}
                aria-label='User profile menu'
              >
                <div className='relative'>
                  <Avatar className='w-8 h-8 ring-2 ring-white shadow-sm'>
                    <AvatarImage
                      src='/api/placeholder/32/32'
                      alt='Muhammad Ismail profile picture'
                    />
                    <AvatarFallback>MI</AvatarFallback>
                  </Avatar>
                  <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
                </div>
                <div className='hidden md:block'>
                  <Typography
                    variant='small'
                    className='font-medium group-hover:text-gray-700'
                  >
                    Muhammad Ismail
                  </Typography>
                  <Typography variant='muted' className='text-xs'>
                    Admin
                  </Typography>
                </div>
                <ChevronDownIcon
                  size={14}
                  className='text-gray-400 hidden md:block group-hover:text-gray-600 transition-colors duration-200'
                  aria-hidden='true'
                />
              </div>

              {/* Custom Actions */}
              {actions && (
                <div className='flex items-center space-x-2'>{actions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className='flex-1 overflow-y-auto p-6'
          role='main'
          aria-label='Dashboard content'
          tabIndex={-1}
          id='main-content'
        >
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {!sidebarCollapsed && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
