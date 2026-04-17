export interface ApiEnvelope<T> {
  status?: string;
  message?: string;
  data?: T;
}

export interface ApiRequestState<T> {
  loading: boolean;
  error: string | null;
  success: string | null;
  data: T | null;
}

export type ApiErrorKind = 'NETWORK' | 'TIMEOUT' | 'AUTH' | 'BUSINESS' | 'UNKNOWN';
