import { baseApi } from './baseApi';
import type { ApiSuccess } from '@/types';

export interface LabelTransferOverviewLabel {
  id: string;
  name: string;
  createdAt: string;
}

export interface LabelTransferOverviewAdmin {
  id: string;
  name: string;
  email: string;
  labels: LabelTransferOverviewLabel[];
}

export interface LabelTransferRecipient {
  _id: string;
  name: string;
  email: string;
}

const injectOptions = { overrideExisting: process.env.NODE_ENV === 'development' } as const;

export const labelTransferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabelTransferOverview: builder.query<
      ApiSuccess<{ admins: LabelTransferOverviewAdmin[] }>,
      void
    >({
      query: () => ({ url: '/label-transfers/overview' }),
      providesTags: ['LabelTransfer'],
    }),
    getLabelTransferRecipients: builder.query<ApiSuccess<LabelTransferRecipient[]>, void>({
      query: () => ({ url: '/label-transfers/recipients' }),
      providesTags: ['LabelTransfer'],
    }),
    transferLabel: builder.mutation<
      ApiSuccess<unknown>,
      { labelId: string; toUserId: string }
    >({
      query: (body) => ({ url: '/label-transfers', method: 'POST', body }),
      invalidatesTags: ['LabelTransfer', 'ReleaseCatalog'],
    }),
  }),
  ...injectOptions,
});

export const {
  useGetLabelTransferOverviewQuery,
  useGetLabelTransferRecipientsQuery,
  useTransferLabelMutation,
} = labelTransferApi;
