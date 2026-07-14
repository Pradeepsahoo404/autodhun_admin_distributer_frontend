import { isElevatedRole } from '@/utils/roles';
import type { AuthUser } from '@/types';

const BANK_NAME_PATTERN = /^[A-Za-z][A-Za-z\s.&'-]*$/;
const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/;
const IFSC_PATTERN = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;

/** True when required bank details are present (Master / Super Admin always complete). */
export function isProfileComplete(user: AuthUser | null | undefined): boolean {
  if (!user) return true;
  if (isElevatedRole(user.role)) return true;
  if (user.profileCompleted === true) return true;

  const bank = user.bankDetails;
  const bankName = bank?.bankName?.trim() ?? '';
  const accountNumber = bank?.accountNumber?.trim() ?? '';
  const ifscCode = bank?.ifscCode?.trim().toUpperCase() ?? '';

  return Boolean(
    bankName &&
      accountNumber &&
      ifscCode &&
      BANK_NAME_PATTERN.test(bankName) &&
      ACCOUNT_NUMBER_PATTERN.test(accountNumber) &&
      IFSC_PATTERN.test(ifscCode),
  );
}
