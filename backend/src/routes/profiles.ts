import { Router } from 'express';
import { profileInputSchema, type Profile } from '@resume/shared';
import { pool } from '../db/pool.js';

export const profilesRouter = Router();

const selectColumns = `
  id, full_name AS "fullName", phone, email,
  linkedin_url AS "linkedinUrl", created_at AS "createdAt"
`;

profilesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query<Profile>(
    `SELECT ${selectColumns} FROM profiles ORDER BY id`,
  );
  res.json(rows);
});

profilesRouter.post('/', async (req, res) => {
  const parsed = profileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid profile', details: parsed.error.issues });
    return;
  }
  const { fullName, phone, email, linkedinUrl } = parsed.data;
  const { rows } = await pool.query<Profile>(
    `INSERT INTO profiles (full_name, phone, email, linkedin_url)
     VALUES ($1, $2, $3, $4)
     RETURNING ${selectColumns}`,
    [fullName, phone, email, linkedinUrl ?? null],
  );
  res.status(201).json(rows[0]);
});
