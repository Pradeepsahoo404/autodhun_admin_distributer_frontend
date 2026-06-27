import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TOKEN_STORAGE_KEY, ACCOUNT_INACTIVE_MESSAGE } from '@/constants';
import { forceLogoutForInactiveAccount, shouldSkipInactiveLogoutRedirect } from '@/utils/accountAccess';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null): void => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const inactiveMessage = extractMessageFromData(error.response?.data);

    if (error.response?.status === 403 && inactiveMessage === ACCOUNT_INACTIVE_MESSAGE) {
      const requestUrl = original?.url ?? '';
      if (!shouldSkipInactiveLogoutRedirect(requestUrl)) {
        forceLogoutForInactiveAccount();
      }
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true },
      );
      const newToken = data?.data?.accessToken as string;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      }
      processQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

const extractMessageFromData = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined;

  const body = data as ApiErrorBody;
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (body.errors) {
    const first = Object.values(body.errors).flat().find(Boolean);
    if (first) return first;
  }

  return undefined;
};

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (axios.isAxiosError(error)) {
    return extractMessageFromData(error.response?.data) ?? fallback;
  }

  // RTK Query `.unwrap()` rejection shape: { status, data: { message } }
  if (error && typeof error === 'object') {
    const rtkError = error as { data?: unknown; error?: string };
    const fromData = extractMessageFromData(rtkError.data);
    if (fromData) return fromData;
    if (typeof rtkError.error === 'string' && rtkError.error.trim()) {
      return rtkError.error;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
