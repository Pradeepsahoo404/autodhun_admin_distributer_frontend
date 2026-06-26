import { ProfileAccountShell } from '@/components/dashboard/profile/ProfileAccountShell';
import { ProfileDataSync } from '@/components/dashboard/profile/ProfileDataSync';
import { ROUTES } from '@/constants';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileAccountShell generalHref={ROUTES.SETTINGS}>
      <ProfileDataSync />
      {children}
    </ProfileAccountShell>
  );
}
