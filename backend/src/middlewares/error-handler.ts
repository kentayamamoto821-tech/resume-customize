import type { ErrorRequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import type { ApiError, ApiIssue } from '@resume/shared';
import { HttpError } from '../utils/http-error.js';
import { logger } from '../utils/logger.js';

function send(res: Response, status: number, error: string, details?: ApiIssue[]) {
  const body: ApiError = details?.length ? { error, details } : { error };
  res.status(status).json(body);
}

function toIssues(err: ZodError): ApiIssue[] {
  return err.issues.map((issue) => ({
    path: issue.path.filter((p): p is string | number => typeof p !== 'symbol'),
    message: issue.message,
  }));
}

/** body-parser errors (malformed JSON, payload too large) carry a 4xx status. */
function isClientBodyError(err: unknown): err is { status: number; type?: string; message: string } {
  if (typeof err !== 'object' || err === null) return false;
  const status = (err as { status?: unknown }).status;
  return typeof status === 'number' && status >= 400 && status < 500;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err instanceof ZodError) {
    send(res, 400, 'Validation failed', toIssues(err));
    return;
  }
  if (err instanceof HttpError) {
    send(res, err.status, err.message, err.details);
    return;
  }
  if (isClientBodyError(err)) {
    send(res, err.status, err.type === 'entity.parse.failed' ? 'Malformed JSON body' : err.message);
    return;
  }

  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, err);
  send(res, 500, 'Internal server error');
};
