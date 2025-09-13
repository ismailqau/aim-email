/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/button';
import { Typography } from '../atoms/typography';
import { Badge } from '../atoms/badge';
import { Avatar, AvatarImage } from '../atoms/avatar';
import {
  NotificationIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  WarningIcon,
  RefreshIcon,
} from '../icons';
import { cn } from '../../utils';

/**
 * Notification Panel Component
 * Displays real-time notifications with filtering and actions
 */

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Campaign Launched Successfully',
        message:
          'Your "Summer Sale 2024" email campaign has been sent to 1,250 subscribers.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        priority: 'high',
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Email Credits',
        message:
          'You have only 150 email credits remaining. Consider upgrading your plan.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'info',
        title: 'New Lead Captured',
        message:
          'Sarah Johnson from TechCorp has signed up for your newsletter.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        priority: 'low',
      },
      {
        id: '4',
        type: 'system',
        title: 'System Maintenance',
        message:
          'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: true,
        priority: 'medium',
      },
      {
        id: '5',
        type: 'error',
        title: 'Campaign Delivery Failed',
        message:
          'Failed to deliver emails to 23 recipients due to invalid addresses.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false,
        priority: 'high',
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { size: 16, className: 'flex-shrink-0' };

    switch (type) {
      case 'success':
        return (
          <CheckIcon
            {...iconProps}
            className={cn(iconProps.className, 'text-green-600')}
          />
        );
      case 'warning':
        return (
          <WarningIcon
            {...iconProps}
            className={cn(iconProps.className, 'text-yellow-600')}
          />
        );
      case 'error':
        return (
          <CloseIcon
            {...iconProps}
            className={cn(iconProps.className, 'text-red-600')}
          />
        );
      case 'info':
      case 'system':
      default:
        return (
          <InfoIcon
            {...iconProps}
            className={cn(iconProps.className, 'text-blue-600')}
          />
        );
    }
  };

  const getNotificationBgColor = (
    type: Notification['type'],
    isRead: boolean
  ) => {
    const baseClasses = isRead ? 'bg-gray-50' : 'bg-white';
    const borderClasses = {
      success: 'border-l-4 border-green-500',
      warning: 'border-l-4 border-yellow-500',
      error: 'border-l-4 border-red-500',
      info: 'border-l-4 border-blue-500',
      system: 'border-l-4 border-purple-500',
    };

    return cn(baseClasses, borderClasses[type]);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const refreshNotifications = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.isRead;
      case 'important':
        return notif.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div
      className={cn('fixed inset-0 z-50 lg:relative lg:inset-auto', className)}
    >
      {/* Backdrop for mobile */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 lg:hidden'
        onClick={onClose}
      />

      {/* Panel */}
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl lg:absolute lg:top-12 lg:right-0 lg:h-auto lg:max-h-96 lg:rounded-lg lg:border border-gray-200 animate-in slide-in-from-right duration-300'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'>
          <div className='flex items-center space-x-2'>
            <NotificationIcon size={20} className='text-blue-600' />
            <Typography variant='h4' className='font-semibold text-gray-900'>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Badge variant='default' size='sm' className='animate-pulse'>
                {unreadCount}
              </Badge>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={refreshNotifications}
              disabled={isLoading}
              className='p-1 hover:bg-white hover:shadow-sm transition-all duration-200'
              aria-label='Refresh notifications'
            >
              <RefreshIcon
                size={16}
                className={cn('text-gray-500', isLoading && 'animate-spin')}
              />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='p-1 hover:bg-white hover:shadow-sm transition-all duration-200 lg:hidden'
              aria-label='Close notifications'
            >
              <CloseIcon size={16} className='text-gray-500' />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className='flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200'>
          <div className='flex space-x-2'>
            {(['all', 'unread', 'important'] as const).map(filterType => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setFilter(filterType)}
                className='text-xs capitalize transition-all duration-200'
              >
                {filterType}
              </Button>
            ))}
          </div>

          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={markAllAsRead}
              className='text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200'
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className='max-h-80 overflow-y-auto'>
          {filteredNotifications.length === 0 ? (
            <div className='p-8 text-center'>
              <NotificationIcon
                size={48}
                className='mx-auto text-gray-300 mb-4'
              />
              <Typography variant='p' className='text-gray-500'>
                No notifications found
              </Typography>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group',
                    getNotificationBgColor(
                      notification.type,
                      notification.isRead
                    )
                  )}
                  onClick={() =>
                    !notification.isRead && markAsRead(notification.id)
                  }
                >
                  <div className='flex items-start space-x-3'>
                    {/* Icon or Avatar */}
                    <div className='flex-shrink-0 mt-1'>
                      {notification.avatar ? (
                        <Avatar
                          size='sm'
                          className='ring-2 ring-white shadow-sm'
                        >
                          <AvatarImage src={notification.avatar} alt='User' />
                        </Avatar>
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <Typography
                            variant='p'
                            className={cn(
                              'font-medium text-sm',
                              notification.isRead
                                ? 'text-gray-700'
                                : 'text-gray-900'
                            )}
                          >
                            {notification.title}
                          </Typography>
                          <Typography
                            variant='small'
                            className={cn(
                              'mt-1 text-xs',
                              notification.isRead
                                ? 'text-gray-500'
                                : 'text-gray-600'
                            )}
                          >
                            {notification.message}
                          </Typography>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          {!notification.isRead && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={e => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className='p-1 hover:bg-blue-100 text-blue-600'
                              aria-label='Mark as read'
                            >
                              <CheckIcon size={12} />
                            </Button>
                          )}

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className='p-1 hover:bg-red-100 text-red-600'
                            aria-label='Delete notification'
                          >
                            <CloseIcon size={12} />
                          </Button>
                        </div>
                      </div>

                      {/* Timestamp and Priority */}
                      <div className='flex items-center justify-between mt-2'>
                        <Typography
                          variant='small'
                          className='text-xs text-gray-400'
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>

                        {notification.priority === 'high' && (
                          <Badge
                            variant='destructive'
                            size='sm'
                            className='text-xs'
                          >
                            High Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className='p-4 border-t border-gray-200 bg-gray-50'>
            <Button
              variant='ghost'
              className='w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200'
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
