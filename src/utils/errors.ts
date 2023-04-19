'use strict';

export class BaseError extends Error {
  errorId: string;
  errorText: string;
  originalError: Error | null;
  data: unknown | null;
  constructor(errorId: string, errorText: string, originalError: Error | null, data: unknown | null) {
    super();
    this.errorId = errorId;
    this.errorText = errorText;
    this.originalError = originalError;
    this.data = data;
  }
}

/**
 * System Errors
 * Service is not functioning as expected
 */

export class ServiceError extends BaseError {
  constructor(errorText: string, originalError: Error | null = null, data: { req?: unknown; resp?: unknown; time?: unknown } | null = null) {
    super('service-error', errorText || 'Service Error', originalError || null, data || null);
  }
}
