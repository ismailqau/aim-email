/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

/**
 * Typography System for Dashboard
 * Provides consistent font sizes, weights, and line heights
 */

export interface TextStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  fontFamily?: string;
  textDecoration?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ],
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
  },

  // Font Sizes (rem units for scalability)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles for Components
  textStyles: {
    // Headings
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
      fontFamily: 'Cal Sans, Inter, system-ui, sans-serif',
    } as TextStyle,
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    } as TextStyle,
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      lineHeight: '1.375',
    } as TextStyle,
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: '600',
      lineHeight: '1.375',
    } as TextStyle,
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: '600',
      lineHeight: '1.5',
    } as TextStyle,
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: '600',
      lineHeight: '1.5',
    } as TextStyle,

    // Body Text
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      lineHeight: '1.5',
    } as TextStyle,
    bodyLarge: {
      fontSize: '1.125rem', // 18px
      fontWeight: '400',
      lineHeight: '1.625',
    } as TextStyle,
    bodySmall: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
    } as TextStyle,

    // UI Text
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    } as TextStyle,
    label: {
      fontSize: '0.875rem', // 14px
      fontWeight: '500',
      lineHeight: '1.5',
    } as TextStyle,
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0.025em',
    } as TextStyle,
    link: {
      fontSize: '1rem', // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      textDecoration: 'underline',
    } as TextStyle,

    // Dashboard Specific
    metric: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      lineHeight: '1',
      letterSpacing: '-0.025em',
    } as TextStyle,
    metricLabel: {
      fontSize: '0.875rem', // 14px
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0.025em',
      textTransform: 'uppercase',
    } as TextStyle,
    cardTitle: {
      fontSize: '1.125rem', // 18px
      fontWeight: '600',
      lineHeight: '1.375',
    } as TextStyle,
    cardSubtitle: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
    } as TextStyle,
    sidebarItem: {
      fontSize: '0.875rem', // 14px
      fontWeight: '500',
      lineHeight: '1.25',
    } as TextStyle,
    breadcrumb: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.25',
    } as TextStyle,
    badge: {
      fontSize: '0.75rem', // 12px
      fontWeight: '500',
      lineHeight: '1',
      letterSpacing: '0.025em',
    } as TextStyle,
    tooltip: {
      fontSize: '0.75rem', // 12px
      fontWeight: '400',
      lineHeight: '1.25',
    } as TextStyle,
  },
};

// Utility functions for typography
export const getTextStyle = (style: keyof typeof typography.textStyles) => {
  return typography.textStyles[style];
};

export const getFontSize = (size: keyof typeof typography.fontSize) => {
  return typography.fontSize[size];
};

export const getFontWeight = (weight: keyof typeof typography.fontWeight) => {
  return typography.fontWeight[weight];
};

export const getLineHeight = (height: keyof typeof typography.lineHeight) => {
  return typography.lineHeight[height];
};

// CSS-in-JS helper for styled-components or emotion
export const createTextStyle = (
  styleName: keyof typeof typography.textStyles
) => {
  const style = typography.textStyles[styleName];
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing || 'normal',
    fontFamily: style.fontFamily || typography.fontFamily.sans.join(', '),
    textTransform: style.textTransform || 'none',
  };
};

// Responsive typography utilities
export const responsiveText = {
  // Mobile-first responsive headings
  h1Responsive: {
    fontSize: '1.875rem', // 30px on mobile
    '@media (min-width: 768px)': {
      fontSize: '2.25rem', // 36px on tablet+
    },
    '@media (min-width: 1024px)': {
      fontSize: '3rem', // 48px on desktop
    },
  },
  h2Responsive: {
    fontSize: '1.5rem', // 24px on mobile
    '@media (min-width: 768px)': {
      fontSize: '1.875rem', // 30px on tablet+
    },
    '@media (min-width: 1024px)': {
      fontSize: '2.25rem', // 36px on desktop
    },
  },
  bodyResponsive: {
    fontSize: '0.875rem', // 14px on mobile
    '@media (min-width: 768px)': {
      fontSize: '1rem', // 16px on tablet+
    },
  },
};

export default typography;
