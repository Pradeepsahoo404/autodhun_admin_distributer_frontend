'use client';

import { useEffect, useState } from 'react';
import { LookupSelectField } from '@/components/dashboard/create-release/LookupSelectField';

interface LookupSelectWrapperProps {
  value: string;
  onChange: (value: string) => void;
  loadOptions: () => string[];
  persistOption: (value: string) => void;
  selectPlaceholder: string;
  addNewLabel: string;
  error?: string;
  'aria-label': string;
}

export function LookupSelectWrapper({
  value,
  onChange,
  loadOptions,
  persistOption,
  selectPlaceholder,
  addNewLabel,
  error,
  'aria-label': ariaLabel,
}: LookupSelectWrapperProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions(loadOptions());
  }, [loadOptions]);

  const handlePersist = (name: string) => {
    persistOption(name);
    setOptions(loadOptions());
  };

  return (
    <div>
      <LookupSelectField
        value={value}
        onChange={onChange}
        options={options}
        onPersistOption={handlePersist}
        selectPlaceholder={selectPlaceholder}
        addNewLabel={addNewLabel}
        aria-label={ariaLabel}
      />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
