import type { ApiIssue } from '@resume/shared';

/** An error that maps directly to an HTTP response; thrown from services, rendered by the error handler. */
export class HttpError extends Error {
  readonly status: number;
  readonly details?: ApiIssue[];

  constructor(status: number, message: string, details?: ApiIssue[]) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: ApiIssue[]) =>
  new HttpError(400, message, details);

export const notFound = (resource: string) => new HttpError(404, `${resource} not found`);

export const conflict = (message: string, details?: ApiIssue[]) =>
  new HttpError(409, message, details);
