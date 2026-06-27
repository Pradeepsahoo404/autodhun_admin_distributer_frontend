import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ACCOUNT_INACTIVE_MESSAGE, TOKEN_STORAGE_KEY } from '@/constants';

export const INACTIVE_LOGOUT_MESSAGE_KEY = 'autodhun_inactive_logout_message';

/** Auth endpoints where inactive is an expected login error — do not force redirect. */
export const SKIP_INACTIVE_LOGOUT_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-register-otp',
  '/auth/verify-login-otp',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
  '/auth/logout',
] as const;

export function shouldSkipInactiveLogoutRedirect(url: string): boolean {
  return SKIP_INACTIVE_LOGOUT_PATHS.some((path) => url.includes(path));
}

export function extractRtkErrorMessage(error: FetchBaseQueryError): string | undefined {
  if (!error.data || typeof error.data !== 'object') return undefined;
  const body = error.data as { message?: string };
  return typeof body.message === 'string' ? body.message : undefined;
}

export function isAccountInactiveError(error: FetchBaseQueryError): boolean {
  const message = extractRtkErrorMessage(error);
  return message === ACCOUNT_INACTIVE_MESSAGE;
}

export function storeInactiveAccountMessage(): void {
  sessionStorage.setItem(INACTIVE_LOGOUT_MESSAGE_KEY, ACCOUNT_INACTIVE_MESSAGE);
}

/** Read and clear the one-time inactive logout message (used on the login page). */
export function consumeInactiveAccountMessage(): string | null {
  const message = sessionStorage.getItem(INACTIVE_LOGOUT_MESSAGE_KEY);
  if (message) {
    sessionStorage.removeItem(INACTIVE_LOGOUT_MESSAGE_KEY);
    return message;
  }
  return null;
}

export function forceLogoutForInactiveAccount(): void {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/login') return;

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  storeInactiveAccountMessage();
  window.location.replace('/login');
}
