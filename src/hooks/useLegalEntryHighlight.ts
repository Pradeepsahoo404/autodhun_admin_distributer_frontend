'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Reads `?entry=` from the URL to highlight a Rights Manager table row. */
export function useLegalEntryHighlight(): string | null {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHighlightId(params.get('entry'));
  }, []);

  return highlightId;
}

export function legalEntryRowClass(
  baseClass: string,
  entryId: string,
  highlightId: string | null,
): string {
  return cn(
    baseClass,
    highlightId === entryId && 'bg-[#1a1a1a] ring-1 ring-inset ring-neutral-500',
  );
}
