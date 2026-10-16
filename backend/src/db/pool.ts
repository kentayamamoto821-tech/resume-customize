import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

pool.on('error', (err) => logger.error('Unexpected error on idle database client', err));

export async function isDatabaseReachable(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
