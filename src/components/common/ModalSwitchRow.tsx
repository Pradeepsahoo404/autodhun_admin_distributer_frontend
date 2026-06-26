'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ModalSwitchRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
}

export function ModalSwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
  ariaLabel,
}: ModalSwitchRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3.5">
      <div>
        <Label className="text-[13px] font-medium text-neutral-300">{label}</Label>
        {description ? <p className="mt-0.5 text-[12px] text-neutral-500">{description}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={ariaLabel} />
    </div>
  );
}
