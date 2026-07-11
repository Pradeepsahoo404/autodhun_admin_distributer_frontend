import { baseApi } from './baseApi';
import type { ApiSuccess, PaginatedMeta } from '@/types';

export interface LabelUpdateUser {
  _id: string;
  name: string;
  email: string;
}

export interface LabelUpdateRecord {
  _id: string;
  label: { _id: string; name: string; status?: string } | string;
  previousName: string;
  newName: string;
  owner: LabelUpdateUser;
  updatedBy: LabelUpdateUser;
  createdAt: string;
}

export interface LabelTransferHistoryRecord {
  _id: string;
  labelName: string;
  fromUser: LabelUpdateUser;
  toUser: LabelUpdateUser;
  transferredBy: LabelUpdateUser;
  createdAt: string;
}

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const labelUpdateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabelUpdates: builder.query<
      ApiSuccess<PaginatedMeta & { items: LabelUpdateRecord[] }>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({ url: '/label-updates', params }),
      providesTags: ['LabelUpdate'],
    }),
    getLabelTransferHistory: builder.query<
      ApiSuccess<PaginatedMeta & { items: LabelTransferHistoryRecord[] }>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({ url: '/label-transfers/history', params }),
      providesTags: ['LabelTransfer'],
    }),
  }),
  ...injectOptions,
});

export const { useGetLabelUpdatesQuery, useGetLabelTransferHistoryQuery } = labelUpdateApi;
