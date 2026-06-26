import { ProfileAccountShell } from '@/components/dashboard/profile/ProfileAccountShell';
import { ProfileDataSync } from '@/components/dashboard/profile/ProfileDataSync';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileAccountShell>
      <ProfileDataSync />
      {children}
    </ProfileAccountShell>
  );
}
