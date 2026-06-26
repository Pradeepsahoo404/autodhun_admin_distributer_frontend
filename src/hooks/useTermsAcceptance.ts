'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLazyGetTermsStatusQuery, useAcceptTermsMutation } from '@/store/api';

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Loads terms status from the API and persists acceptance to the user record when possible. */
export function useTermsAcceptance(email?: string) {
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState('');

  const [fetchTermsStatus, { isFetching: checkingStatus }] = useLazyGetTermsStatusQuery();
  const [acceptTerms, { isLoading: saving }] = useAcceptTermsMutation();

  useEffect(() => {
    const normalized = email?.trim().toLowerCase() ?? '';
    if (!isValidEmail(normalized)) return;

    void (async () => {
      try {
        const response = await fetchTermsStatus(normalized).unwrap();
        if (response.data.termsAccepted) {
          setChecked(true);
          setError('');
        }
      } catch {
        /* New or unknown email — user must accept manually */
      }
    })();
  }, [email, fetchTermsStatus]);

  const handleChange = useCallback(
    async (value: boolean) => {
      if (!value) {
        setChecked(false);
        setError('');
        return;
      }

      const normalized = email?.trim().toLowerCase() ?? '';
      if (isValidEmail(normalized)) {
        try {
          await acceptTerms({ email: normalized }).unwrap();
          setChecked(true);
          setError('');
        } catch {
          setChecked(false);
          setError('Unable to save your agreement. Please try again.');
        }
        return;
      }

      setChecked(true);
      setError('');
    },
    [acceptTerms, email],
  );

  return {
    checked,
    saving: saving || checkingStatus,
    error,
    handleChange,
    setError,
  };
}
