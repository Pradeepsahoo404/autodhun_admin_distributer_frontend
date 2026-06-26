'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ModuleGuard } from '@/components/dashboard/ModuleGuard';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { UserProfileSync } from '@/components/auth/UserProfileSync';
import { ProfileCompletionGate } from '@/components/dashboard/ProfileCompletionGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      setDesktopSidebarOpen((open) => !open);
      return;
    }
    setMobileSidebarOpen((open) => !open);
  };

  return (
    <AuthGuard requireAuth>
      <UserProfileSync />
      <ProfileCompletionGate>
        <div className="flex h-screen overflow-hidden bg-brand-black font-sans">
          <Sidebar
            desktopOpen={desktopSidebarOpen}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden font-sans text-[15px] leading-relaxed">
            <Header
              onSidebarToggle={handleSidebarToggle}
              desktopSidebarOpen={desktopSidebarOpen}
              mobileSidebarOpen={mobileSidebarOpen}
            />

            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <div className="min-w-0 flex-1">
                <ModuleGuard>{children}</ModuleGuard>
              </div>
              <DashboardFooter />
            </main>
          </div>
        </div>
      </ProfileCompletionGate>
    </AuthGuard>
  );
}
