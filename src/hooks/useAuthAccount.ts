import { useAppSelector } from '@/hooks/useAppStore';
import { ROLES } from '@/constants';

/** True when the account signs in with Google OAuth (no local password). */
export function useAuthAccount() {
  const { user } = useAppSelector((s) => s.auth);
  const isGoogleAccount = user?.provider === 'google';
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const canManagePassword = Boolean(user && !isGoogleAccount);

  return { user, isGoogleAccount, isSuperAdmin, canManagePassword };
}
