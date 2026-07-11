export const RELEASE_ISRC_SERIES_PREFIX = 'INA8D';

/** Example: INA8D2621862 */
export const RELEASE_ISRC_PATTERN = /^INA8D\d{2}\d{5}$/;

export const RELEASE_ISRC_MESSAGE =
  'ISRC must match format INA8D2621862 (INA8D + 2-digit year + 5-digit sequence)';

/** First generated sequence for the current year series (e.g. INA8D2621862 in 2026). */
export const RELEASE_ISRC_MIN_SEQUENCE = 21862;

export function getReleaseIsrcYearSuffix(date = new Date()): string {
  return String(date.getFullYear()).slice(-2);
}

/** Example ISRC for the current year — year segment updates automatically (e.g. 26 in 2026). */
export function formatReleaseIsrcExample(date = new Date()): string {
  return `${RELEASE_ISRC_SERIES_PREFIX}${getReleaseIsrcYearSuffix(date)}${String(RELEASE_ISRC_MIN_SEQUENCE).padStart(5, '0')}`;
}

export function getReleaseIsrcPlaceholderHint(date = new Date()): string {
  const example = formatReleaseIsrcExample(date);
  return `Example format: INA8D + 2-digit year + 5-digit sequence (e.g. ${example})`;
}

export function isValidReleaseIsrc(value: string): boolean {
  return RELEASE_ISRC_PATTERN.test(value.trim().toUpperCase());
}

export function isGeneratedIsrcLocked(
  isrcOption: 'own' | 'generate',
  isrc: string | undefined,
  isEdit: boolean,
): boolean {
  return isEdit && isrcOption === 'generate' && Boolean(isrc?.trim());
}
