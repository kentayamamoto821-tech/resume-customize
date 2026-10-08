import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import type { ApiError } from '@resume/shared';
import { config } from './config.js';
import { HttpError, isPgError, PG_UNIQUE_VIOLATION } from './errors.js';
import { healthRouter } from './routes/health.js';
import { usersRouter } from './routes/users.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/users', usersRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' } satisfies ApiError);
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.issues } satisfies ApiError);
      return;
    }
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message, details: err.details } satisfies ApiError);
      return;
    }
    if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
      const message =
        err.constraint === 'users_email_key' ? 'Email is already in use' : 'Duplicate value';
      res.status(409).json({ error: message } satisfies ApiError);
      return;
    }
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({ error: 'Malformed JSON body' } satisfies ApiError);
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' } satisfies ApiError);
  };
  app.use(errorHandler);

  return app;
}
