import { ROUTES } from '@/constants';
import { isMasterAdminRole } from '@/utils/roles';
import type { AuthUser } from '@/types';

/** Home route after login — Master lands on Master Dashboard. */
export function getPostLoginRoute(user?: Pick<AuthUser, 'role' | 'isMasterAdmin'> | null): string {
  if (user?.isMasterAdmin || isMasterAdminRole(user?.role)) {
    return ROUTES.MASTER_DASHBOARD;
  }
  return ROUTES.DASHBOARD;
}
