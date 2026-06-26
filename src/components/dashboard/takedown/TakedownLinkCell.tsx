'use client';

import { ExternalLink } from 'lucide-react';

interface TakedownLinkCellProps {
  href: string;
}

export function TakedownLinkCell({ href }: TakedownLinkCellProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-brand-lime hover:underline"
    >
      View
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
