'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PasswordInput } from '@/components/common/PasswordInput';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  fieldSize?: 'default' | 'compact';
}

/**
 * Auth input — label above field, rounded-2xl shell, green focus ring.
 * Password fields include a show/hide toggle.
 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, required = true, fieldSize = 'default', className, id, placeholder, type, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const compact = fieldSize === 'compact';
    const inputClassName = cn(
      'w-full rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 text-white outline-none transition-colors',
      compact ? 'h-[46px] text-[14px]' : 'h-[52px] text-[15px]',
      'placeholder:text-neutral-500',
      'focus:border-[#3e5c38] focus:ring-1 focus:ring-[#3e5c38]/50',
      error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30',
      className,
    );

    return (
      <div className="w-full">
        <label
          htmlFor={fieldId}
          className={cn('block font-medium text-white', compact ? 'mb-1 text-[13px]' : 'mb-2 text-sm')}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {type === 'password' ? (
          <PasswordInput
            id={fieldId}
            ref={ref}
            placeholder={placeholder ?? label}
            inputClassName={inputClassName}
            {...props}
          />
        ) : (
          <input
            id={fieldId}
            ref={ref}
            type={type}
            placeholder={placeholder ?? label}
            className={inputClassName}
            {...props}
          />
        )}
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
AuthField.displayName = 'AuthField';
