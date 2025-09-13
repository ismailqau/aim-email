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
import { LucideIcon } from 'lucide-react';

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    variant: {
      default: 'text-slate-600',
      primary: 'text-blue-600',
      secondary: 'text-slate-500',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      destructive: 'text-red-600',
      muted: 'text-slate-400',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface IconProps
  extends React.HTMLAttributes<SVGElement>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  label?: string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size, variant, icon: IconComponent, label, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, variant }), className)}
        aria-label={label}
        {...props}
      />
    );
  }
);
Icon.displayName = 'Icon';

export { Icon, iconVariants };
