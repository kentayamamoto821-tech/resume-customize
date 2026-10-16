import type { ApiIssue } from '@resume/shared';
import { ApiRequestError } from '../apis/client';

export type FieldErrors = Record<string, string>;

/** Converts validation issues (from zod or the API) to `{ field: firstMessage }`. */
export function issuesToFieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in errors)) errors[field] = issue.message;
  }
  return errors;
}

/** Field-level errors carried by an API error response, if any. */
export function getApiFieldErrors(error: unknown): FieldErrors {
  if (error instanceof ApiRequestError && error.body.details) {
    return issuesToFieldErrors(error.body.details as ApiIssue[]);
  }
  return {};
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiRequestError) return error.body.error;
  if (error instanceof TypeError) return 'Unable to reach the server. Is the backend running?';
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
