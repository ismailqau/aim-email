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
import { Search, X } from 'lucide-react';
import { Input } from '../atoms/input';
import { Button } from '../atoms/button';
import { Icon } from '../atoms/icon';
import { cn } from '../../utils';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  debounceMs?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      showClearButton = true,
      debounceMs = 300,
      className,
      value,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);
    };

    const handleClear = () => {
      setInternalValue('');
      onSearch?.('');
      onClear?.();
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div className={cn('relative', className)}>
        <Icon
          icon={Search}
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
          size='sm'
        />
        <Input
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          className='pl-10 pr-10'
          {...props}
        />
        {showClearButton && internalValue && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleClear}
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100'
          >
            <Icon icon={X} size='sm' />
          </Button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
