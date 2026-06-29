const SESSION_RETRY_MS = 400;
const SESSION_MAX_RETRIES = 15;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Poll the server session endpoint until NextAuth exposes the Google id_token. */
export async function fetchGoogleIdToken(): Promise<string | null> {
  for (let attempt = 0; attempt < SESSION_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch('/api/auth/google-id-token', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const data = (await response.json()) as { idToken?: string };
        if (data.idToken) return data.idToken;
      }
    } catch {
      // Retry until attempts are exhausted.
    }

    if (attempt < SESSION_MAX_RETRIES - 1) {
      await sleep(SESSION_RETRY_MS);
    }
  }

  return null;
}

export function googleCompleteCallbackUrl(): string {
  if (typeof window === 'undefined') return '/auth/google-complete';
  return `${window.location.origin}/auth/google-complete`;
}
