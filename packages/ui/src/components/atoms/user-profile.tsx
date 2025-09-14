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
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Typography } from './typography';

interface UserProfileProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'other';
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const getDefaultAvatar = (gender: 'male' | 'female' | 'other' = 'male') => {
  if (gender === 'female') {
    return '/icons/female-avatar.svg';
  }
  return '/icons/male-avatar.svg';
};

const getInitials = (name: string = '') => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function UserProfile({
  name = 'User',
  email,
  avatarUrl,
  gender = 'male',
  size = 'md',
  showDetails = true,
  className = '',
}: UserProfileProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const avatarSrc =
    imageError || !avatarUrl ? getDefaultAvatar(gender) : avatarUrl;
  const initials = getInitials(name);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className='relative'>
        <Avatar className={`${sizeClasses[size]} ring-2 ring-white shadow-sm`}>
          <AvatarImage
            src={avatarSrc}
            alt={name}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Online status indicator */}
        <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
      </div>

      {showDetails && (
        <div className='flex-1 min-w-0'>
          <Typography
            variant='small'
            className='font-medium truncate text-gray-900 dark:text-gray-100'
          >
            {name}
          </Typography>
          {email && (
            <Typography
              variant='muted'
              className='text-xs truncate text-gray-600 dark:text-gray-400'
            >
              {email}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
