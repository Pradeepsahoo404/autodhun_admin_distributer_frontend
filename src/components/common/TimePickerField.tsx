'use client';

import { useMemo, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { tableControlClass } from '@/components/common/tableControls';

interface TimePickerFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minTime?: string;
}

type Period = 'AM' | 'PM';
type PickerMode = 'hour' | 'minute';

const CLOCK_SIZE = 220;
const CLOCK_CENTER = CLOCK_SIZE / 2;
const CLOCK_RADIUS = 78;
const NUMBER_RADIUS = 62;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function formatTime24(hour: number, minute: number) {
  return `${pad(hour)}:${pad(minute)}`;
}

function to12Hour(hour24: number): { hour12: number; period: Period } {
  const period: Period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
}

function to24Hour(hour12: number, period: Period) {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function parseTimeToMinutes(value: string): number | null {
  const parsed = parseTime(value);
  if (!parsed) return null;
  return parsed.hour * 60 + parsed.minute;
}

function isTimeBefore(time: string, minTime: string): boolean {
  const t = parseTimeToMinutes(time);
  const min = parseTimeToMinutes(minTime);
  if (t === null || min === null) return false;
  return t < min;
}

function formatDisplay12(hour24: number, minute: number) {
  const { hour12, period } = to12Hour(hour24);
  return `${hour12}:${pad(minute)} ${period}`;
}

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CLOCK_CENTER + radius * Math.cos(rad),
    y: CLOCK_CENTER + radius * Math.sin(rad),
  };
}

function ClockFace({
  mode,
  hour12,
  minute,
  period,
  minTime,
  onSelectHour,
  onSelectMinute,
}: {
  mode: PickerMode;
  hour12: number;
  minute: number;
  period: Period;
  minTime?: string;
  onSelectHour: (hour: number) => void;
  onSelectMinute: (minute: number) => void;
}) {
  const minMinutes = minTime ? parseTimeToMinutes(minTime) : null;

  const isHourDisabled = (label: number) => {
    if (minMinutes === null) return false;
    const hour24 = to24Hour(label, period);
    return hour24 * 60 + 59 < minMinutes;
  };

  const isMinuteDisabled = (label: number) => {
    if (minMinutes === null) return false;
    const hour24 = to24Hour(hour12, period);
    return hour24 * 60 + label < minMinutes;
  };
  const hourLabels = useMemo(() => Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)), []);
  const minuteLabels = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), []);

  const handAngle =
    mode === 'hour'
      ? (hour12 % 12) * 30 + minute * 0.5
      : minute * 6;

  const handEnd = polarToCartesian(handAngle, mode === 'hour' ? 42 : 54);

  return (
    <div className="relative mx-auto" style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}>
      <svg width={CLOCK_SIZE} height={CLOCK_SIZE} className="select-none">
        <circle
          cx={CLOCK_CENTER}
          cy={CLOCK_CENTER}
          r={CLOCK_RADIUS}
          fill="#111"
          stroke="#2a2a2a"
          strokeWidth={1.5}
        />
        <circle cx={CLOCK_CENTER} cy={CLOCK_CENTER} r={3} fill="#A3FF12" />
        <line
          x1={CLOCK_CENTER}
          y1={CLOCK_CENTER}
          x2={handEnd.x}
          y2={handEnd.y}
          stroke="#A3FF12"
          strokeWidth={mode === 'hour' ? 2.5 : 2}
          strokeLinecap="round"
        />

        {(mode === 'hour' ? hourLabels : minuteLabels).map((label, index) => {
          const angle = index * 30;
          const pos = polarToCartesian(angle, NUMBER_RADIUS);
          const selected =
            mode === 'hour'
              ? hour12 === label
              : minute >= label && minute < label + 5 && label === Math.floor(minute / 5) * 5;
          const optionDisabled = mode === 'hour' ? isHourDisabled(label) : isMinuteDisabled(label);

          return (
            <g key={`${mode}-${label}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={16}
                fill={selected ? 'rgba(163, 255, 18, 0.2)' : 'transparent'}
                className={cn(optionDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer')}
                onClick={() => {
                  if (optionDisabled) return;
                  if (mode === 'hour') onSelectHour(label);
                  else onSelectMinute(label);
                }}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  'text-[13px] font-medium',
                  optionDisabled ? 'cursor-not-allowed fill-neutral-600' : 'cursor-pointer',
                  !optionDisabled && (selected ? 'fill-brand-lime' : 'fill-neutral-300'),
                )}
                onClick={() => {
                  if (optionDisabled) return;
                  if (mode === 'hour') onSelectHour(label);
                  else onSelectMinute(label);
                }}
              >
                {mode === 'minute' ? pad(label) : label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function TimePickerField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select time',
  className,
  disabled,
  minTime,
}: TimePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PickerMode>('hour');
  const [timeError, setTimeError] = useState('');
  const parsed = parseTime(value);

  const initial = parsed ?? { hour: 12, minute: 0 };
  const initial12 = to12Hour(initial.hour);

  const [hour12, setHour12] = useState(initial12.hour12);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial12.period);

  const syncFromValue = (nextValue: string) => {
    const p = parseTime(nextValue);
    if (!p) {
      setHour12(12);
      setMinute(0);
      setPeriod('AM');
      return;
    }
    const h12 = to12Hour(p.hour);
    setHour12(h12.hour12);
    setMinute(p.minute);
    setPeriod(h12.period);
  };

  const apply = () => {
    const next = formatTime24(to24Hour(hour12, period), minute);
    if (minTime && isTimeBefore(next, minTime)) {
      setTimeError('Time cannot be in the past');
      return;
    }
    setTimeError('');
    onChange(next);
    setOpen(false);
  };

  const clear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange('');
  };

  const display = parsed ? formatDisplay12(parsed.hour, parsed.minute) : placeholder;
  const preview = formatDisplay12(to24Hour(hour12, period), minute);

  const adjustMinute = (delta: number) => {
    setMinute((m) => {
      let next = (m + delta + 60) % 60;
      const candidate = formatTime24(to24Hour(hour12, period), next);
      if (minTime && isTimeBefore(candidate, minTime)) {
        return m;
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label htmlFor={id} className="text-xs font-medium text-neutral-400">
          {label}
        </Label>
      ) : null}
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return;
          setOpen(next);
          if (next) {
            syncFromValue(value);
            setMode('hour');
            setTimeError('');
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              tableControlClass,
              'w-full justify-start gap-2.5 px-3.5 font-normal',
              !value && 'text-neutral-600',
            )}
          >
            <Clock className="h-4 w-4 shrink-0 text-brand-lime" />
            <span className="flex-1 truncate text-left text-[14px]">{display}</span>
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
                aria-label={`Clear ${label || 'time'}`}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-[#222] bg-[#0a0a0a] p-0" align="start">
          <div className="p-4">
            <p className="mb-3 text-center text-[12px] font-medium text-neutral-500">Select start time</p>

            <div className="mb-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setMode('hour')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[22px] font-semibold tabular-nums transition-colors',
                  mode === 'hour' ? 'bg-brand-lime/15 text-brand-lime' : 'text-white hover:bg-[#1a1a1a]',
                )}
              >
                {hour12}
              </button>
              <span className="text-[22px] font-semibold text-neutral-500">:</span>
              <button
                type="button"
                onClick={() => setMode('minute')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[22px] font-semibold tabular-nums transition-colors',
                  mode === 'minute' ? 'bg-brand-lime/15 text-brand-lime' : 'text-white hover:bg-[#1a1a1a]',
                )}
              >
                {pad(minute)}
              </button>
              <div className="ml-2 flex overflow-hidden rounded-lg border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={cn(
                    'px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                    period === 'AM' ? 'bg-brand-lime text-black' : 'bg-[#141414] text-neutral-400 hover:text-white',
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={cn(
                    'px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                    period === 'PM' ? 'bg-brand-lime text-black' : 'bg-[#141414] text-neutral-400 hover:text-white',
                  )}
                >
                  PM
                </button>
              </div>
            </div>

            <p className="mb-2 text-center text-[11px] text-neutral-600">
              {mode === 'hour' ? 'Tap an hour on the clock' : 'Tap minutes (5-min steps) or fine-tune below'}
            </p>

            <ClockFace
              mode={mode}
              hour12={hour12}
              minute={minute}
              period={period}
              minTime={minTime}
              onSelectHour={(h) => {
                setHour12(h);
                setMode('minute');
                setTimeError('');
              }}
              onSelectMinute={(m) => {
                setMinute(m);
                setTimeError('');
              }}
            />

            {mode === 'minute' ? (
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustMinute(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a2a2a] text-neutral-400 hover:border-brand-lime/40 hover:text-white"
                  aria-label="Decrease minute"
                >
                  −
                </button>
                <span className="min-w-[4rem] text-center text-[14px] font-medium text-white">{pad(minute)} min</span>
                <button
                  type="button"
                  onClick={() => adjustMinute(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a2a2a] text-neutral-400 hover:border-brand-lime/40 hover:text-white"
                  aria-label="Increase minute"
                >
                  +
                </button>
              </div>
            ) : null}

            <p className="mt-3 text-center text-[13px] text-neutral-500">
              Selected: <span className="font-medium text-white">{preview}</span>
            </p>

            {timeError ? (
              <p className="mt-2 text-center text-[12px] text-red-400">{timeError}</p>
            ) : null}

            <button
              type="button"
              onClick={apply}
              className="mt-3 w-full rounded-lg bg-brand-lime py-2.5 text-[13px] font-semibold text-black hover:bg-brand-lime-dark"
            >
              Apply
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
