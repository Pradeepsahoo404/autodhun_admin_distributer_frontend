import type { UseFormSetValue, UseFormTrigger } from 'react-hook-form';

type ClaimLabelFields = {
  senderLabelName: string;
  receiverLabelName: string;
};

export type ClaimLabelFieldName = keyof ClaimLabelFields;

/** Update one claim label field and re-validate match against the other. */
export function updateClaimLabelField(
  field: ClaimLabelFieldName,
  setValue: UseFormSetValue<ClaimLabelFields>,
  trigger: UseFormTrigger<ClaimLabelFields>,
  value: string,
) {
  setValue(field, value, { shouldDirty: true, shouldValidate: false });
  void trigger(['senderLabelName', 'receiverLabelName']);
}
