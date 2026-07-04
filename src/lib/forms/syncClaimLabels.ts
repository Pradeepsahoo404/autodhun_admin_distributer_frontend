import type { UseFormSetValue, UseFormTrigger } from 'react-hook-form';

type ClaimLabelFields = {
  senderLabelName: string;
  receiverLabelName: string;
};

export type ClaimLabelFieldName = keyof ClaimLabelFields;

/** Update one claim label field and re-validate match against the other. */
export function updateClaimLabelField<T extends ClaimLabelFields>(
  field: ClaimLabelFieldName,
  setValue: UseFormSetValue<T>,
  trigger: UseFormTrigger<T>,
  value: string,
) {
  setValue(field as keyof T & ClaimLabelFieldName, value as T[keyof T & ClaimLabelFieldName], {
    shouldDirty: true,
    shouldValidate: false,
  });
  void trigger(['senderLabelName', 'receiverLabelName'] as Parameters<UseFormTrigger<T>>[0]);
}
