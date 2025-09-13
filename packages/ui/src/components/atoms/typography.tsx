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

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      code: 'relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-slate-700',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-slate-500',
    },
    color: {
      default: 'text-slate-900',
      muted: 'text-slate-500',
      primary: 'text-blue-600',
      secondary: 'text-slate-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      destructive: 'text-red-600',
    },
  },
  defaultVariants: {
    variant: 'p',
    color: 'default',
  },
});

type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'div'
  | 'blockquote'
  | 'ul'
  | 'code';

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, as, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);

    return React.createElement(Component, {
      ref,
      className: cn(typographyVariants({ variant, color }), className),
      ...props,
    });
  }
);

function getDefaultElement(
  variant: TypographyProps['variant']
): TypographyElement {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'blockquote':
      return 'blockquote';
    case 'list':
      return 'ul';
    case 'code':
      return 'code';
    default:
      return 'p';
  }
}

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
