'use client';

import { useParams } from 'next/navigation';
import { AdminAccountsListPage } from '@/components/dashboard/users/AdminAccountsListPage';

export default function ActiveAccountsSectionPage() {
  const params = useParams();
  const section = typeof params.section === 'string' ? params.section : 'active';

  if (section === 'deactive') {
    return (
      <AdminAccountsListPage
        pageTitle="Deactive Account"
        pageDescription="Review and manage deactivated accounts"
        fixedStatusFilter="inactive"
        tableTitle="Deactive accounts"
        permissionModule="active-accounts"
      />
    );
  }

  return (
    <AdminAccountsListPage
      pageTitle="Active Account"
      pageDescription="Manage active platform accounts"
      fixedStatusFilter="active"
      tableTitle="Active accounts"
      showStats
      showInviteAction
      permissionModule="active-accounts"
    />
  );
}
