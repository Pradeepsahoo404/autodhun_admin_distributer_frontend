'use client';

import { useEffect } from 'react';

/** Prevents body/html scroll so only the dashboard main area scrolls (fixes double scrollbar). */
export function CreateReleaseScrollFix({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const main = document.querySelector('main');
    const mainContent = main?.firstElementChild;

    html.classList.add('release-wizard-scroll-lock');
    mainContent?.classList.add('release-wizard-main-content');

    return () => {
      html.classList.remove('release-wizard-scroll-lock');
      mainContent?.classList.remove('release-wizard-main-content');
    };
  }, []);

  return <div className="release-wizard-root w-full">{children}</div>;
}
