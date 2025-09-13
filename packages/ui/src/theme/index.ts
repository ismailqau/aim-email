/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

import { colors } from './colors';
import { typography } from './typography';

/**
 * Complete Design System Theme
 * Combines all design tokens for consistent UI
 */

// Spacing scale (rem units)
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Dashboard specific shadows
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover:
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  sidebar: '2px 0 8px 0 rgba(0, 0, 0, 0.1)',
  dropdown:
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation durations
export const duration = {
  fastest: '75ms',
  faster: '100ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '1000ms',
};

// Animation easing functions
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Custom dashboard easings
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Component variants
export const variants = {
  button: {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.white,
      borderColor: colors.primary[600],
      '&:hover': {
        backgroundColor: colors.primary[700],
        borderColor: colors.primary[700],
      },
      '&:focus': {
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
    },
    secondary: {
      backgroundColor: colors.gray[100],
      color: colors.gray[900],
      borderColor: colors.gray[300],
      '&:hover': {
        backgroundColor: colors.gray[200],
        borderColor: colors.gray[400],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      borderColor: colors.primary[600],
      '&:hover': {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[700],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.gray[600],
      borderColor: 'transparent',
      '&:hover': {
        backgroundColor: colors.gray[100],
        color: colors.gray[900],
      },
    },
  },
  badge: {
    default: {
      backgroundColor: colors.gray[100],
      color: colors.gray[800],
    },
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[800],
    },
    success: {
      backgroundColor: colors.success[100],
      color: colors.success[800],
    },
    warning: {
      backgroundColor: colors.warning[100],
      color: colors.warning[800],
    },
    error: {
      backgroundColor: colors.error[100],
      color: colors.error[800],
    },
  },
};

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  duration,
  easing,
  variants,
};

// Theme utilities
export const getColor = (path: string) => {
  const keys = path.split('.');
  let result: any = colors;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
};

export const getSpacing = (value: keyof typeof spacing) => {
  return spacing[value];
};

export const getShadow = (value: keyof typeof shadows) => {
  return shadows[value];
};

export const getRadius = (value: keyof typeof borderRadius) => {
  return borderRadius[value];
};

// CSS custom properties generator
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {};

  // Generate color variables
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'object') {
      Object.entries(colorValue).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    } else {
      cssVars[`--color-${colorName}`] = colorValue;
    }
  });

  // Generate spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Generate shadow variables
  Object.entries(shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  return cssVars;
};

export default theme;
