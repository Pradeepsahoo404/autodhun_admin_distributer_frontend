'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AppModal } from '@/components/common/AppModal';
import { useGetUserByIdQuery } from '@/store/api';
import { UserDetailTabs } from './UserDetailTabs';
import { UserDetailsContent, UserDetailsHeader } from './UserDetailsContent';
import type { User } from '@/types';

interface ViewUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function ViewUserDialog({ open, user, onClose }: ViewUserDialogProps) {
  const [tab, setTab] = useState<'general' | 'bank'>('general');
  const { data, isLoading, isFetching } = useGetUserByIdQuery(user?._id ?? '', {
    skip: !open || !user?._id,
  });

  const details = data?.data ?? user;
  const loading = isLoading || (isFetching && !data);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Admin details"
      description="Complete profile and bank information"
      size="xl"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2a2a2a] px-5 text-[14px] font-medium text-neutral-300 transition-colors hover:border-brand-lime/30 hover:text-white"
          >
            Close
          </button>
        </div>
      }
    >
      {loading || !details ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-lime" />
        </div>
      ) : (
        <div className="space-y-4">
          <UserDetailsHeader user={details} />
          <UserDetailTabs active={tab} onChange={setTab} />
          <UserDetailsContent user={details} tab={tab} />
        </div>
      )}
    </AppModal>
  );
}
