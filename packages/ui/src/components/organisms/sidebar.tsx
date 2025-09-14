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

// Conditional imports for Next.js modules
let Link: any;
let usePathname: any;

try {
  Link = require('next/link').default;
  usePathname = require('next/navigation').usePathname;
} catch {
  // Fallback components when Next.js is not available
  Link = ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  usePathname = () => '/';
}
import { Button } from '../atoms/button';
import { Typography } from '../atoms/typography';
import { Badge } from '../atoms/badge';
import { UserProfile } from '../atoms/user-profile';
import {
  DashboardIcon,
  LeadsIcon,
  CampaignsIcon,
  AnalyticsIcon,
  ReportsIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  BellIcon,
} from '../icons';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Lead Management',
    icon: LeadsIcon,
    children: [
      {
        id: 'all-leads',
        label: 'All Leads',
        icon: LeadsIcon,
        href: '/dashboard/leads',
      },
      {
        id: 'import-leads',
        label: 'Import Leads',
        icon: LeadsIcon,
        href: '/dashboard/leads/import',
      },
      {
        id: 'lead-scoring',
        label: 'Lead Scoring',
        icon: LeadsIcon,
        href: '/dashboard/leads/scoring',
      },
    ],
  },
  {
    id: 'campaigns',
    label: 'Email Campaigns',
    icon: CampaignsIcon,
    children: [
      {
        id: 'all-campaigns',
        label: 'All Campaigns',
        icon: CampaignsIcon,
        href: '/dashboard/campaigns',
      },
      {
        id: 'create-campaign',
        label: 'Create Campaign',
        icon: CampaignsIcon,
        href: '/dashboard/campaigns/create',
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: CampaignsIcon,
        href: '/dashboard/campaigns/templates',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: AnalyticsIcon,
    href: '/dashboard/analytics',
    badge: 'New',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: ReportsIcon,
    href: '/dashboard/reports',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: UserIcon,
    href: '/dashboard/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    children: [
      {
        id: 'general',
        label: 'General',
        icon: SettingsIcon,
        href: '/dashboard/settings',
      },
      {
        id: 'email-config',
        label: 'Email Configuration',
        icon: SettingsIcon,
        href: '/dashboard/settings/email',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: SettingsIcon,
        href: '/dashboard/settings/integrations',
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    dashboard: DashboardIcon,
    leads: LeadsIcon,
    campaigns: CampaignsIcon,
    analytics: AnalyticsIcon,
    reports: ReportsIcon,
    settings: SettingsIcon,
    user: UserIcon,
  };

  return iconMap[iconName] || DashboardIcon;
};

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  // Load expanded items from localStorage on component mount
  useEffect(() => {
    const savedExpandedItems = localStorage.getItem('sidebar-expanded-items');
    if (savedExpandedItems) {
      try {
        setExpandedItems(JSON.parse(savedExpandedItems));
      } catch (error) {
        console.warn('Failed to parse saved sidebar state:', error);
      }
    }
  }, []);

  // Save expanded items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'sidebar-expanded-items',
      JSON.stringify(expandedItems)
    );
  }, [expandedItems]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newExpandedItems = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      return newExpandedItems;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const IconComponent = getIconComponent(item.id);

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
              active
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 dark:border-blue-800'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
            } ${isCollapsed ? 'justify-center' : ''}`}
            aria-expanded={isExpanded}
            aria-haspopup='true'
            aria-label={`${item.label} menu`}
          >
            <div className='flex items-center space-x-3'>
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                }`}
                aria-hidden='true'
              />
              {!isCollapsed && (
                <>
                  <span className='transition-all duration-300'>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant='secondary'
                      className='ml-auto animate-pulse'
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDownIcon
                className={`w-4 h-4 transform transition-transform duration-200 text-gray-400 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden='true'
              />
            )}
          </button>
        ) : (
          <Link href={item.href || '#'}>
            <div
              className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 dark:border-blue-800'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              } ${isCollapsed ? 'justify-center' : ''}`}
              role='menuitem'
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                }`}
                aria-hidden='true'
              />
              {!isCollapsed && (
                <>
                  <span className='transition-all duration-300'>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant='secondary'
                      className='ml-auto animate-pulse'
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </Link>
        )}

        {hasChildren && isExpanded && !isCollapsed && (
          <div
            className='ml-5 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200'
            role='menu'
            aria-label={`${item.label} submenu`}
          >
            {item.children?.map(child => (
              <Link key={child.id} href={child.href || '#'}>
                <div
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                    isActive(child.href)
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <span className='truncate'>{child.label}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md'>
              <span className='text-white font-bold text-sm'>AE</span>
            </div>
            {!isCollapsed && (
              <div className='transition-all duration-300'>
                <Typography variant='h4' className='font-bold text-blue-600'>
                  AI Email System
                </Typography>
                <Typography variant='small' className='text-gray-500'>
                  Dashboard
                </Typography>
              </div>
            )}
          </div>
          <Button variant='ghost' size='sm' onClick={onToggle} className='p-2'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className='flex-1 p-4 space-y-1 overflow-y-auto'
        role='navigation'
        aria-label='Main navigation'
      >
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* User Profile */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
        <div
          className={`p-3 rounded-lg hover:bg-white hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer group ${isCollapsed ? 'flex justify-center' : ''}`}
        >
          <UserProfile
            name='Muhammad Ismail'
            email='ismail@aimnovo.com'
            gender='male'
            size='md'
            showDetails={!isCollapsed}
            className='group-hover:text-gray-700'
          />
          {!isCollapsed && (
            <ChevronRightIcon className='w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 ml-auto' />
          )}
        </div>

        {!isCollapsed && (
          <div className='mt-3 flex space-x-2'>
            <Button variant='ghost' size='sm' className='flex-1'>
              <SettingsIcon />
            </Button>
            <Button variant='ghost' size='sm' className='flex-1 relative'>
              <BellIcon />
              <Badge className='absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 animate-pulse' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
