import type { ApiErrorKind } from '../types/api/common';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor(message: string, kind: ApiErrorKind, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.statusCode = statusCode;
    this.details = details;
  }
}
