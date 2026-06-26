import { Trash2 } from 'lucide-react';

interface ModalDeleteBodyProps {
  name: string;
  subtitle?: string;
  message: string;
}

export function ModalDeleteBody({ name, subtitle, message }: ModalDeleteBodyProps) {
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.1)]">
        <Trash2 className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <p className="text-[15px] font-medium text-white">{name}</p>
      {subtitle ? <p className="mt-1 text-[13px] text-neutral-500">{subtitle}</p> : null}

      <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-neutral-500">{message}</p>
    </div>
  );
}
