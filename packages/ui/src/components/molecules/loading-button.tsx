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
import { Button, ButtonProps } from '../atoms/button';
import { Spinner } from '../atoms/spinner';
import { cn } from '../../utils';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { loading = false, loadingText, children, disabled, className, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn('relative', className)}
        {...props}
      >
        {loading && (
          <>
            <Spinner size='sm' variant='white' className='mr-2' />
            {loadingText || 'Loading...'}
          </>
        )}
        {!loading && children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
