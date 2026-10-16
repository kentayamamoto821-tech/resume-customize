import type { RequestHandler } from 'express';
import type { ApiError } from '@resume/shared';

export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ApiError = { error: `Route ${req.method} ${req.path} not found` };
  res.status(404).json(body);
};
