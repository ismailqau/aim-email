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
import { cn } from '../../utils';
import { Label } from '../atoms/label';
import { Input } from '../atoms/input';
import { Typography } from '../atoms/typography';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      required,
      error,
      hint,
      className,
      inputProps,
      labelProps,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const errorId = React.useId();
    const hintId = React.useId();

    return (
      <div className={cn('space-y-2', className)} {...props}>
        {label && (
          <Label
            htmlFor={inputId}
            required={required}
            variant={error ? 'error' : 'default'}
            {...labelProps}
          >
            {label}
          </Label>
        )}

        <Input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(error && errorId, hint && hintId)}
          className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
          {...inputProps}
        />

        {hint && !error && (
          <Typography
            id={hintId}
            variant='small'
            color='muted'
            className='text-xs'
          >
            {hint}
          </Typography>
        )}

        {error && (
          <Typography
            id={errorId}
            variant='small'
            color='destructive'
            className='text-xs'
            role='alert'
          >
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
