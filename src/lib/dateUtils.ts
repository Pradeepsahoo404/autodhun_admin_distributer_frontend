import { format, isValid, parse, startOfDay } from 'date-fns';

/** API / form value: `yyyy-MM-dd` */
export function toApiDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Display value: `dd-MM-yyyy` */
export function formatDisplayDate(date: Date): string {
  return format(date, 'dd-MM-yyyy');
}

export function parseApiDate(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? startOfDay(parsed) : undefined;
}

export function startOfDayDate(date: Date): Date {
  return startOfDay(date);
}

export function isAfterDay(date: Date, max: Date): boolean {
  return startOfDay(date).getTime() > startOfDay(max).getTime();
}

export function isBeforeDay(date: Date, min: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(min).getTime();
}
