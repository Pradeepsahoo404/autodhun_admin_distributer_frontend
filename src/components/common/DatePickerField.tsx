'use client';

import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { formatDisplayDate, isAfterDay, isBeforeDay, parseApiDate, toApiDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { tableControlClass } from '@/components/common/tableControls';

interface DatePickerFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDate?: string;
  minDate?: string;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  placeholder = 'dd-mm-yyyy',
  className,
  disabled,
  maxDate,
  minDate,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseApiDate(value);
  const max = maxDate ? parseApiDate(maxDate) : undefined;
  const min = minDate ? parseApiDate(minDate) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(toApiDate(date));
    setOpen(false);
  };

  const clear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-xs font-medium text-neutral-400">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              tableControlClass,
              'w-full min-w-[190px] justify-start gap-2.5 px-3.5 font-normal',
              !value && 'text-neutral-600',
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-brand-lime" />
            <span className="flex-1 truncate text-left text-[14px]">
              {selected ? formatDisplayDate(selected) : placeholder}
            </span>
            {value ? (
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange('');
                  }
                }}
                className="rounded-md p-0.5 text-neutral-500 hover:bg-[#1f1f1f] hover:text-white"
                aria-label={`Clear ${label}`}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={(date) => {
              if (max && isAfterDay(date, max)) return true;
              if (min && isBeforeDay(date, min)) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
