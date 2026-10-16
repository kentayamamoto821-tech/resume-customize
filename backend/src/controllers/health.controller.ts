import type { Request, Response } from 'express';
import type { HealthResponse } from '@resume/shared';
import { isDatabaseReachable } from '../db/pool.js';

async function check(_req: Request, res: Response) {
  const db = await isDatabaseReachable();
  const body: HealthResponse = {
    status: db ? 'ok' : 'degraded',
    db,
    time: new Date().toISOString(),
  };
  res.status(db ? 200 : 503).json(body);
}

export const healthController = { check };
