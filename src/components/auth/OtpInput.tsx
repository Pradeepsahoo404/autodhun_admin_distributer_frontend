'use client';

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { OTP_LENGTH } from '@/constants';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * 6-box OTP input with auto-focus, paste support and backspace navigation.
 * Auto-submit fires once per completed code — never re-fires on parent re-render.
 */
export function OtpInput({
  length = OTP_LENGTH,
  value,
  onChange,
  onComplete,
  disabled,
  error,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [focused, setFocused] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const lastAutoSubmitted = useRef<string | null>(null);

  onCompleteRef.current = onComplete;

  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (value.length < length) {
      lastAutoSubmitted.current = null;
      return;
    }
    if (disabled || value.length !== length) return;
    if (lastAutoSubmitted.current === value) return;

    lastAutoSubmitted.current = value;
    onCompleteRef.current?.(value);
  }, [value, length, disabled]);

  const update = (next: string): void => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    onChange(clean);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[index] = char;
    const next = arr.join('').slice(0, length);
    update(next);
    if (char && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = value.split('');
      if (arr[index]) {
        arr[index] = '';
        update(arr.join(''));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const prev = value.split('');
        prev[index - 1] = '';
        update(prev.join(''));
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    update(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div>
      <div className="flex gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit.trim()}
            disabled={disabled}
            onFocus={() => setFocused(i)}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={cn(
              'h-[52px] w-[52px] rounded-2xl border bg-[#161616] text-center text-xl font-semibold text-white outline-none transition-colors',
              focused === i ? 'border-[#3e5c38] ring-1 ring-[#3e5c38]/50' : 'border-[#1f1f1f]',
              error && 'border-red-500/60',
            )}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
