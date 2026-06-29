const NEXT_AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthCallback:
    'Google sign-in failed. Add redirect URI: /api/auth/callback/google and verify GOOGLE_CLIENT_SECRET.',
  Configuration:
    'Google sign-in is misconfigured. Set NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET.',
  AccessDenied: 'Google sign-in was denied.',
  Verification: 'Google sign-in verification failed. Try again.',
};

/** Read NextAuth ?error= from the URL once, clean the query string, return a user-facing message. */
export function consumeNextAuthErrorMessage(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  if (!error) return null;

  params.delete('error');
  const remaining = params.toString();
  const nextUrl = `${window.location.pathname}${remaining ? `?${remaining}` : ''}`;
  window.history.replaceState({}, '', nextUrl);

  return NEXT_AUTH_ERROR_MESSAGES[error] ?? `Google sign-in failed (${error}).`;
}
