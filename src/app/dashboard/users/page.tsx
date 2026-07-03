'use client';

import { AdminAccountsListPage } from '@/components/dashboard/users/AdminAccountsListPage';

export default function UsersPage() {
  return (
    <AdminAccountsListPage
      pageTitle="Users"
      pageDescription="Manage system users"
      showStats
      showInviteAction
    />
  );
}
