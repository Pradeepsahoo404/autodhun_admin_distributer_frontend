interface ReleaseDetailRowProps {
  label: string;
  value: string;
  inline?: boolean;
}

export function ReleaseDetailRow({ label, value, inline = false }: ReleaseDetailRowProps) {
  if (inline) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111] px-3 py-1 text-[11px]">
        <span className="text-neutral-500">{label}</span>
        <span className="font-medium text-neutral-200">{value}</span>
      </span>
    );
  }

  return (
    <div className="flex items-start gap-6 border-b border-[#161616] py-3 last:border-b-0">
      <span className="w-[9.5rem] shrink-0 text-[12px] font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-[14px] leading-relaxed text-neutral-100 break-words">{value}</span>
    </div>
  );
}
