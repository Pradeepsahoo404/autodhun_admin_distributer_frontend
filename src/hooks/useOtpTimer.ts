'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseOtpTimerOptions {
  initialSeconds?: number;
  onExpire?: () => void;
}

/** Countdown timer for OTP resend cooldown. */
export function useOtpTimer({ initialSeconds = 40, onExpire }: UseOtpTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || seconds <= 0) {
      if (seconds <= 0) onExpire?.();
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, active, onExpire]);

  const reset = useCallback(
    (newSeconds = initialSeconds) => {
      setSeconds(newSeconds);
      setActive(true);
    },
    [initialSeconds],
  );

  const canResend = seconds <= 0;

  return { seconds, canResend, reset, active };
}
