'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PasswordInput } from '@/components/common/PasswordInput';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Auth input — label above field, rounded-2xl shell, green focus ring.
 * Password fields include a show/hide toggle.
 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, className, id, placeholder, type, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const inputClassName = cn(
      'h-[52px] w-full rounded-2xl border border-[#1f1f1f] bg-[#161616] px-4 text-[15px] text-white outline-none transition-colors',
      'placeholder:text-neutral-500',
      'focus:border-[#3e5c38] focus:ring-1 focus:ring-[#3e5c38]/50',
      error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30',
      className,
    );

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="mb-2 block text-sm font-medium text-white">
          {label}
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
