'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppModal } from '@/components/common/AppModal';
import { TableSelectField } from '@/components/common/TableSelectField';
import {
  useGetLabelTransferRecipientsQuery,
  useTransferLabelMutation,
  type LabelTransferOverviewAdmin,
} from '@/store/api';
import { getApiErrorMessage } from '@/services/apiClient';

interface TransferLabelDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  admins: LabelTransferOverviewAdmin[];
  initialLabel?: {
    id: string;
    name: string;
    fromAdminId: string;
    fromAdminName: string;
  } | null;
}

export function TransferLabelDialog({
  open,
  onClose,
  onSuccess,
  admins,
  initialLabel,
}: TransferLabelDialogProps) {
  const { data: recipientsData, isLoading: recipientsLoading } = useGetLabelTransferRecipientsQuery(undefined, {
    skip: !open,
  });
  const [transferLabel, { isLoading: transferring }] = useTransferLabelMutation();

  const [labelId, setLabelId] = useState('');
  const [toUserId, setToUserId] = useState('');

  const allLabels = useMemo(
    () =>
      admins.flatMap((admin) =>
        admin.labels.map((label) => ({
          ...label,
          ownerId: admin.id,
          ownerName: admin.name,
        })),
      ),
    [admins],
  );

  const labelOptions = useMemo(
    () => [
      { value: '', label: '- Select a label -' },
      ...allLabels.map((label) => ({
        value: label.id,
        label: `${label.name} (${label.ownerName})`,
      })),
    ],
    [allLabels],
  );

  const recipientOptions = useMemo(() => {
    const selected = allLabels.find((label) => label.id === labelId);
    const ownerId = selected?.ownerId ?? initialLabel?.fromAdminId;

    return [
      { value: '', label: recipientsLoading ? 'Loading admins...' : '- Select recipient admin -' },
      ...(recipientsData?.data ?? [])
        .filter((admin) => admin._id !== ownerId)
        .map((admin) => ({ value: admin._id, label: `${admin.name} (${admin.email})` })),
    ];
  }, [allLabels, initialLabel?.fromAdminId, labelId, recipientsData?.data, recipientsLoading]);

  useEffect(() => {
    if (!open) return;
    setLabelId(initialLabel?.id ?? '');
    setToUserId('');
  }, [open, initialLabel?.id]);

  useEffect(() => {
    setToUserId('');
  }, [labelId]);

  const handleSubmit = async () => {
    if (!labelId || !toUserId) return;

    try {
      await transferLabel({ labelId, toUserId }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const selectedLabel = allLabels.find((label) => label.id === labelId);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Transfer Label"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2a2a2a] px-5 text-[14px] font-medium text-neutral-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!labelId || !toUserId || transferring}
            className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl bg-brand-lime px-5 text-[14px] font-semibold text-black hover:bg-brand-lime-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {transferring ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Transfer'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          Transfer a label to another admin. The previous owner will lose access immediately.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Label</label>
          <TableSelectField
            value={labelId}
            onChange={setLabelId}
            options={labelOptions}
            searchable
            searchPlaceholder="Search labels..."
            className="w-full"
            inModal
            aria-label="Label to transfer"
          />
        </div>

        {selectedLabel ? (
          <p className="text-xs text-neutral-500">
            Current owner: <span className="text-neutral-300">{selectedLabel.ownerName}</span>
          </p>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Transfer to</label>
          <TableSelectField
            value={toUserId}
            onChange={setToUserId}
            options={recipientOptions}
            searchable
            searchPlaceholder="Search admins..."
            className="w-full"
            inModal
            disabled={!labelId || recipientsLoading}
            aria-label="Recipient admin"
          />
        </div>
      </div>
    </AppModal>
  );
}
