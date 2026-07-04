export const RELEASE_ISRC_SERIES_PREFIX = 'INA8D';

/** Example: INA8D2621862 */
export const RELEASE_ISRC_PATTERN = /^INA8D\d{2}\d{5}$/;

export const RELEASE_ISRC_MESSAGE =
  'ISRC must match format INA8D2621862 (INA8D + 2-digit year + 5-digit sequence)';

export const RELEASE_ISRC_EXAMPLE = 'INA8D2621862';

export function getReleaseIsrcYearSuffix(date = new Date()): string {
  return String(date.getFullYear()).slice(-2);
}

export function formatReleaseIsrcExample(): string {
  return `${RELEASE_ISRC_SERIES_PREFIX}${getReleaseIsrcYearSuffix()}00001`;
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
