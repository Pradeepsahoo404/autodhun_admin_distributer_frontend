import { parseApiDate, toApiDate } from '@/lib/dateUtils';

const API_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function todayApiDate(): string {
  return toApiDate(new Date());
}

export function isValidApiDate(value: string): boolean {
  if (!API_DATE_PATTERN.test(value)) return false;
  return Boolean(parseApiDate(value));
}

export function isPastApiDate(value: string): boolean {
  if (!isValidApiDate(value)) return true;
  const parsed = parseApiDate(value)!;
  const today = parseApiDate(todayApiDate())!;
  return parsed.getTime() < today.getTime();
}

/** True when date is today or before today. */
export function isTodayOrPastApiDate(value: string): boolean {
  if (!isValidApiDate(value)) return true;
  const parsed = parseApiDate(value)!;
  const today = parseApiDate(todayApiDate())!;
  return parsed.getTime() <= today.getTime();
}

export function tomorrowApiDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toApiDate(d);
}

export function minScheduledReleaseDate(releasingDate?: string): string {
  const tomorrow = tomorrowApiDate();
  if (!releasingDate || !isValidApiDate(releasingDate)) return tomorrow;
  return releasingDate > tomorrow ? releasingDate : tomorrow;
}

export function parseTimeToMinutes(value: string): number | null {
  const hms = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(value.trim());
  if (hms) {
    const hour = Number(hms[1]);
    const minute = Number(hms[2]);
    const second = Number(hms[3]);
    if (hour < 0 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;
    return hour * 60 + minute + Math.floor(second / 60);
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
}

export function isValidCrbtStartTime(value: string): boolean {
  const trimmed = value.trim();
  if (!/^(\d{1,2}):(\d{2}):(\d{2})$/.test(trimmed)) return false;
  const [, h, m, s] = trimmed.match(/^(\d+):(\d+):(\d+)$/) ?? [];
  if (!h || !m || !s) return false;
  const hour = Number(h);
  const minute = Number(m);
  const second = Number(s);
  return minute >= 0 && minute <= 59 && second >= 0 && second <= 59 && hour >= 0;
}

export function isPastTimeForToday(time: string): boolean {
  const minutes = parseTimeToMinutes(time);
  if (minutes === null) return true;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  return minutes < current;
}

export function isTimeBefore(time: string, minTime: string): boolean {
  const t = parseTimeToMinutes(time);
  const min = parseTimeToMinutes(minTime);
  if (t === null || min === null) return false;
  return t < min;
}

export function currentTimeHHmm(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
