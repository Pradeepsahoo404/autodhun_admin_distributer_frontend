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

export function minScheduledReleaseDate(releasingDate: string): string {
  const today = todayApiDate();
  if (!isValidApiDate(releasingDate)) return today;
  return releasingDate < today ? today : releasingDate;
}

export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
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
