/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

import React from 'react';

/**
 * Premium Smart Icon Pack for Dashboard
 * SVG-based icons for better scalability and performance
 */

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Navigation Icons
export const DashboardIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
      fill={color}
    />
  </svg>
);

export const LeadsIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10.5 8.01 7.99A2.996 2.996 0 0 0 6.94 7H5.94c-1.39 0-2.59.95-2.9 2.31L2 15h2.5v7h15z'
      fill={color}
    />
  </svg>
);

export const CampaignsIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
      fill={color}
    />
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'
      fill={color}
    />
  </svg>
);

export const ReportsIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'
      fill={color}
    />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z'
      fill={color}
    />
  </svg>
);

// Action Icons
export const SearchIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
      fill={color}
    />
  </svg>
);

export const NotificationIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'
      fill={color}
    />
  </svg>
);

export const MessageIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'
      fill={color}
    />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
      fill={color}
    />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' fill={color} />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'
      fill={color}
    />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' fill={color} />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'
      fill={color}
    />
  </svg>
);

// Status Icons
export const CheckIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' fill={color} />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
      fill={color}
    />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' fill={color} />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
      fill={color}
    />
  </svg>
);

// Chart Icons
export const TrendUpIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z'
      fill={color}
    />
  </svg>
);

export const TrendDownIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z'
      fill={color}
    />
  </svg>
);

// File Icons
export const DownloadIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' fill={color} />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'
      fill={color}
    />
  </svg>
);

// Additional Business Icons
export const CalendarIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'
      fill={color}
    />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' fill={color} />
  </svg>
);

export const ExportIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z'
      fill={color}
    />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'
      fill={color}
    />
  </svg>
);

// Additional Icons for New Pages
export const TestIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'
      fill={color}
    />
  </svg>
);

export const ConnectIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'
      fill={color}
    />
  </svg>
);

export const DisconnectIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M4 12c0-1.71 1.39-3.1 3.1-3.1h1.9v-2H7C4.24 6.9 2 9.14 2 12s2.24 5.1 5 5.1h1.9v-2H7c-1.71 0-3.1-1.39-3.1-3.1zm4.9 0c0 .55.45 1 1 1h4.2c.55 0 1-.45 1-1s-.45-1-1-1H9.9c-.55 0-1 .45-1 1zm8.1-5.1h-1.9v2H17c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-1.9v2H17c2.76 0 5-2.24 5-5.1s-2.24-5.1-5-5.1z'
      fill={color}
    />
  </svg>
);

export const SaveIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z'
      fill={color}
    />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M8 5v14l11-7z' fill={color} />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' fill={color} />
  </svg>
);

export const TemplateIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'
      fill={color}
    />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'
      fill={color}
    />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
      fill={color}
    />
  </svg>
);

export const MoveIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M13 20h-2V8l-5.5 5.5-1.42-1.42L12 4.16l7.92 7.92-1.42 1.42L13 8v12z'
      fill={color}
    />
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z'
      fill={color}
    />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill={color} />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
      fill={color}
    />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'
      fill={color}
    />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    className={className}
  >
    <path
      d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
      fill={color}
    />
  </svg>
);

/**
 * Icon component with consistent styling
 */
export interface IconComponentProps extends IconProps {
  name: string;
}

export const Icon: React.FC<IconComponentProps> = ({ name, ...props }) => {
  const iconMap: Record<string, React.FC<IconProps>> = {
    dashboard: DashboardIcon,
    leads: LeadsIcon,
    campaigns: CampaignsIcon,
    analytics: AnalyticsIcon,
    reports: ReportsIcon,
    settings: SettingsIcon,
    search: SearchIcon,
    notification: NotificationIcon,
    message: MessageIcon,
    user: UserIcon,
    menu: MenuIcon,
    chevronDown: ChevronDownIcon,
    chevronRight: ChevronRightIcon,
    check: CheckIcon,
    close: CloseIcon,
    warning: WarningIcon,
    info: InfoIcon,
    trendUp: TrendUpIcon,
    trendDown: TrendDownIcon,
    download: DownloadIcon,
    upload: UploadIcon,
    calendar: CalendarIcon,
    filter: FilterIcon,
    export: ExportIcon,
    refresh: RefreshIcon,
    test: TestIcon,
    connect: ConnectIcon,
    disconnect: DisconnectIcon,
    save: SaveIcon,
    play: PlayIcon,
    pause: PauseIcon,
    template: TemplateIcon,
    eye: EyeIcon,
    arrowLeft: ArrowLeftIcon,
    move: MoveIcon,
    trendingUp: TrendingUpIcon,
    plus: PlusIcon,
    trash: TrashIcon,
    edit: EditIcon,
    x: XIcon,
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};

export default Icon;
