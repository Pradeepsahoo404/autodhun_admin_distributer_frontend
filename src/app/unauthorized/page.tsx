'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/constants';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-black px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        <ShieldAlert className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="mt-6 font-sans text-3xl font-bold text-white">403 — Unauthorized</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        You don&apos;t have permission to view this module. If you believe this is a mistake, contact your administrator
        to request access.
      </p>
      <Link
        href={ROUTES.DASHBOARD}
        className="mt-8 rounded-lg bg-brand-lime px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-brand-lime-dark"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
