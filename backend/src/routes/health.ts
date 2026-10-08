import { Router } from 'express';
import type { HealthResponse } from '@resume/shared';
import { pool } from '../db/pool.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  let db = false;
  try {
    await pool.query('SELECT 1');
    db = true;
  } catch {
    // db unreachable; report degraded
  }
  const body: HealthResponse = {
    status: db ? 'ok' : 'degraded',
    db,
    time: new Date().toISOString(),
  };
  res.json(body);
});
