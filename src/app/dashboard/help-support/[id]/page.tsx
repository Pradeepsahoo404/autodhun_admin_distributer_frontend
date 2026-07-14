'use client';

import { Suspense, use } from 'react';
import { SupportTicketDetailView } from '@/components/dashboard/help-support/SupportTicketDetailView';

interface SupportTicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SupportTicketDetailPage({ params }: SupportTicketDetailPageProps) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <SupportTicketDetailView ticketId={id} />
    </Suspense>
  );
}
