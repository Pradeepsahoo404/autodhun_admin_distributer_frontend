import { useAppSelector } from '@/hooks/useAppStore';
import { isElevatedRole, isMasterAdminRole } from '@/utils/roles';

/** True when the account signs in with Google OAuth (no local password). */
export function useAuthAccount() {
  const { user } = useAppSelector((s) => s.auth);
  const isGoogleAccount = user?.provider === 'google';
  const isSuperAdmin = isElevatedRole(user?.role);
  const isMasterAdmin = Boolean(user?.isMasterAdmin) || isMasterAdminRole(user?.role);
  const canManagePassword = Boolean(user && !isGoogleAccount);

  return { user, isGoogleAccount, isSuperAdmin, isMasterAdmin, canManagePassword };
}
