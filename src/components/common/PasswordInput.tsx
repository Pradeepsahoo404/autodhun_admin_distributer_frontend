'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName?: string;
}

/** Password input with show/hide toggle — used across auth and profile forms. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, inputClassName, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={cn('relative', className)}>
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          className={cn('pr-11', inputClassName)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((show) => !show)}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 transition-colors',
            'hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-lime/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
