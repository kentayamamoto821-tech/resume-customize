import type { User, UserCreateInput, UserListQuery, UserUpdateInput } from '@resume/shared';
import { pool } from '../db/pool.js';
import { escapeLike } from '../utils/sql.js';

const USER_COLUMNS = `
  id,
  full_name    AS "fullName",
  phone,
  email,
  linkedin_url AS "linkedinUrl",
  created_at   AS "createdAt",
  updated_at   AS "updatedAt"
`;

// API field -> SQL column. Only these columns can be updated, so the dynamic
// SET clause in update() never interpolates user-supplied names.
const UPDATABLE_COLUMNS = {
  fullName: 'full_name',
  phone: 'phone',
  email: 'email',
  linkedinUrl: 'linkedin_url',
} as const satisfies Record<keyof UserUpdateInput, string>;

// $1 is the ILIKE pattern, or NULL to match everything.
const SEARCH_FILTER = 'WHERE $1::text IS NULL OR full_name ILIKE $1 OR email ILIKE $1';

async function findMany({ limit, offset, q }: UserListQuery) {
  const pattern = q ? `%${escapeLike(q)}%` : null;
  const [items, count] = await Promise.all([
    pool.query<User>(
      `SELECT ${USER_COLUMNS} FROM users ${SEARCH_FILTER}
       ORDER BY created_at DESC, id DESC
       LIMIT $2 OFFSET $3`,
      [pattern, limit, offset],
    ),
    pool.query<{ total: number }>(
      `SELECT count(*)::int AS total FROM users ${SEARCH_FILTER}`,
      [pattern],
    ),
  ]);
  return { rows: items.rows, total: count.rows[0].total };
}

async function findById(id: number): Promise<User | null> {
  const { rows } = await pool.query<User>(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

async function create(input: UserCreateInput): Promise<User> {
  const { rows } = await pool.query<User>(
    `INSERT INTO users (full_name, phone, email, linkedin_url)
     VALUES ($1, $2, $3, $4)
     RETURNING ${USER_COLUMNS}`,
    [input.fullName, input.phone, input.email, input.linkedinUrl ?? null],
  );
  return rows[0];
}

async function update(id: number, input: UserUpdateInput): Promise<User | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [field, column] of Object.entries(UPDATABLE_COLUMNS)) {
    const value = input[field as keyof UserUpdateInput];
    if (value === undefined) continue;
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  }
  if (sets.length === 0) return findById(id);

  values.push(id);
  const { rows } = await pool.query<User>(
    `UPDATE users
     SET ${sets.join(', ')}, updated_at = now()
     WHERE id = $${values.length}
     RETURNING ${USER_COLUMNS}`,
    values,
  );
  return rows[0] ?? null;
}

async function remove(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export const userRepository = { findMany, findById, create, update, remove };
