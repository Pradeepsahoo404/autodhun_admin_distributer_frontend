'use client';

import { useMemo } from 'react';
import { LookupSelectField } from '@/components/dashboard/create-release/LookupSelectField';
import {
  useCreateReleaseArtistMutation,
  useCreateReleaseLabelMutation,
  useGetReleaseArtistsQuery,
  useGetReleaseLabelsQuery,
} from '@/store/api';

type CatalogKind = 'artist' | 'label';

interface CatalogLookupSelectProps {
  kind: CatalogKind;
  value: string;
  onChange: (value: string) => void;
  selectPlaceholder: string;
  addNewLabel: string;
  error?: string;
  'aria-label': string;
}

export function CatalogLookupSelect({
  kind,
  value,
  onChange,
  selectPlaceholder,
  addNewLabel,
  error,
  'aria-label': ariaLabel,
}: CatalogLookupSelectProps) {
  const artistsQuery = useGetReleaseArtistsQuery(undefined, { skip: kind !== 'artist' });
  const labelsQuery = useGetReleaseLabelsQuery(undefined, { skip: kind !== 'label' });
  const [createArtist] = useCreateReleaseArtistMutation();
  const [createLabel] = useCreateReleaseLabelMutation();

  const isLoading = kind === 'artist' ? artistsQuery.isLoading : labelsQuery.isLoading;

  const options = useMemo(() => {
    const items = kind === 'artist' ? artistsQuery.data?.data : labelsQuery.data?.data;
    const names = (items ?? []).map((item) => item.name);
    if (value && !names.includes(value)) {
      return [...names, value].sort((a, b) => a.localeCompare(b));
    }
    return names;
  }, [artistsQuery.data?.data, labelsQuery.data?.data, kind, value]);

  const handlePersist = async (name: string) => {
    if (kind === 'artist') {
      await createArtist({ name }).unwrap();
      return;
    }
    await createLabel({ name }).unwrap();
  };

  const duplicateErrorMessage =
    kind === 'artist'
      ? 'An artist with this name already exists'
      : 'A label with this name already exists';

  return (
    <div>
      <LookupSelectField
        value={value}
        onChange={onChange}
        options={options}
        onPersistOption={handlePersist}
        selectPlaceholder={isLoading ? 'Loading...' : selectPlaceholder}
        addNewLabel={addNewLabel}
        duplicateErrorMessage={duplicateErrorMessage}
        disabled={isLoading}
        aria-label={ariaLabel}
      />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
