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
  LayoutDashboard,
  Users,
  Mail,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  Bell,
  Menu,
  X,
} from 'lucide-react';

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
import { cn } from '../../utils';

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
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Lead Management',
    icon: Users,
    children: [
      {
        id: 'all-leads',
        label: 'All Leads',
        icon: Users,
        href: '/dashboard/leads',
      },
      {
        id: 'import-leads',
        label: 'Import Leads',
        icon: Users,
        href: '/dashboard/leads/import',
      },
      {
        id: 'lead-scoring',
        label: 'Lead Scoring',
        icon: Users,
        href: '/dashboard/leads/scoring',
      },
    ],
  },
  {
    id: 'campaigns',
    label: 'Email Campaigns',
    icon: Mail,
    children: [
      {
        id: 'all-campaigns',
        label: 'All Campaigns',
        icon: Mail,
        href: '/dashboard/campaigns',
      },
      {
        id: 'create-campaign',
        label: 'Create Campaign',
        icon: Mail,
        href: '/dashboard/campaigns/create',
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: Mail,
        href: '/dashboard/campaigns/templates',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    badge: 'New',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    href: '/dashboard/reports',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: User,
    href: '/dashboard/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      {
        id: 'general',
        label: 'General',
        icon: Settings,
        href: '/dashboard/settings',
      },
      {
        id: 'email-config',
        label: 'Email Configuration',
        icon: Settings,
        href: '/dashboard/settings/email',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: Settings,
        href: '/dashboard/settings/integrations',
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

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

  const handleKeyNavigation = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const IconComponent = item.icon;

    return (
      <div key={item.id} className={cn('relative', level > 0 && 'ml-4')}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            onKeyDown={e =>
              handleKeyNavigation(e, () => toggleExpanded(item.id))
            }
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
              'hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]',
              active
                ? 'bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 text-blue-700 border border-blue-200/50 shadow-sm backdrop-blur-sm dark:from-blue-500/20 dark:via-blue-500/10 dark:to-purple-500/20 dark:text-blue-300 dark:border-blue-500/30'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900 hover:border hover:border-gray-200/50 dark:text-gray-300 dark:hover:from-gray-800/50 dark:hover:to-gray-700/30 dark:hover:text-gray-100 dark:hover:border-gray-600/30',
              isCollapsed && 'justify-center px-2'
            )}
            aria-expanded={isExpanded}
            aria-haspopup='true'
            aria-label={`${item.label} menu`}
          >
            <div className='flex items-center space-x-3'>
              <div
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-300',
                  active
                    ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-700/50 dark:group-hover:text-gray-200'
                )}
              >
                <IconComponent />
              </div>
              {!isCollapsed && (
                <>
                  <span className='transition-all duration-300 font-medium'>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant='secondary'
                      className='ml-auto animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5'
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 transform transition-all duration-300 text-gray-400 group-hover:text-gray-600',
                  isExpanded && 'rotate-180'
                )}
                aria-hidden='true'
              />
            )}
          </button>
        ) : (
          <Link href={item.href || '#'}>
            <div
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer',
                'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900',
                'hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]',
                active
                  ? 'bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 text-blue-700 border border-blue-200/50 shadow-sm backdrop-blur-sm dark:from-blue-500/20 dark:via-blue-500/10 dark:to-purple-500/20 dark:text-blue-300 dark:border-blue-500/30'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900 hover:border hover:border-gray-200/50 dark:text-gray-300 dark:hover:from-gray-800/50 dark:hover:to-gray-700/30 dark:hover:text-gray-100 dark:hover:border-gray-600/30',
                isCollapsed && 'justify-center px-2'
              )}
              role='menuitem'
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Navigate programmatically if needed
                  const linkElement = e.currentTarget.closest('a');
                  if (linkElement) {
                    linkElement.click();
                  }
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full' />
              )}

              <div
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-300',
                  active
                    ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-700/50 dark:group-hover:text-gray-200'
                )}
              >
                <IconComponent />
              </div>
              {!isCollapsed && (
                <>
                  <span className='transition-all duration-300 font-medium'>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      variant='secondary'
                      className='ml-auto animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5'
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
            className='ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300 border-l border-gray-200/50 dark:border-gray-700/50 pl-4'
            role='menu'
            aria-label={`${item.label} submenu`}
          >
            {item.children?.map(child => (
              <Link key={child.id} href={child.href || '#'}>
                <div
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group cursor-pointer',
                    'hover:scale-[1.01] active:scale-[0.99]',
                    isActive(child.href)
                      ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 border-l-2 border-blue-500 shadow-sm dark:from-blue-900/30 dark:to-blue-900/10 dark:text-blue-300 dark:border-blue-400'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-300 dark:text-gray-400 dark:hover:from-gray-800/30 dark:hover:to-gray-700/20 dark:hover:text-gray-200 dark:hover:border-gray-500'
                  )}
                  role='menuitem'
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const linkElement = e.currentTarget.closest('a');
                      if (linkElement) {
                        linkElement.click();
                      }
                    }
                  }}
                >
                  <div className='w-2 h-2 rounded-full bg-current opacity-30 group-hover:opacity-60 transition-opacity duration-200' />
                  <span className='truncate font-medium'>{child.label}</span>
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
      <div className='flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 dark:from-blue-900/10 dark:via-gray-900 dark:to-purple-900/10 backdrop-blur-sm'>
        <div
          className={cn(
            'flex items-center space-x-3',
            isCollapsed && 'justify-center'
          )}
        >
          <div className='relative w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
            <Mail className='w-5 h-5 text-white' />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse' />
          </div>
          {!isCollapsed && (
            <div className='transition-all duration-300'>
              <Typography
                variant='h4'
                className='font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              >
                AIM Email
              </Typography>
              <Typography
                variant='small'
                className='text-xs text-gray-500 dark:text-gray-400 font-medium'
              >
                Marketing Suite
              </Typography>
            </div>
          )}
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={onToggle}
          className={cn(
            'hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 active:scale-95',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
            'rounded-lg p-2'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Menu className='w-4 h-4 transition-transform duration-300' />
          ) : (
            <X className='w-4 h-4 transition-transform duration-300' />
          )}
        </Button>
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
            <ChevronRight className='w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 ml-auto' />
          )}
        </div>

        {!isCollapsed && (
          <div className='mt-3 flex space-x-2'>
            <Button variant='ghost' size='sm' className='flex-1'>
              <Settings className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='flex-1 relative'>
              <Bell className='w-4 h-4' />
              <Badge className='absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 animate-pulse' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
