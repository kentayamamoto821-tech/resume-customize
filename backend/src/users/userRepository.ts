import type { ListQuery, Paginated, User, UserCreateInput, UserUpdateInput } from '@resume/shared';
import { pool } from '../db/pool.js';

const userColumns = `
  id,
  full_name    AS "fullName",
  phone,
  email,
  linkedin_url AS "linkedinUrl",
  created_at   AS "createdAt",
  updated_at   AS "updatedAt"
`;

// Maps API field names to SQL columns. Only these columns can be updated, so
// the dynamic SET clause in updateUser never interpolates user-supplied names.
const updatableColumns = {
  fullName: 'full_name',
  phone: 'phone',
  email: 'email',
  linkedinUrl: 'linkedin_url',
} as const satisfies Record<keyof UserUpdateInput, string>;

export async function listUsers({ limit, offset }: ListQuery): Promise<Paginated<User>> {
  const [items, count] = await Promise.all([
    pool.query<User>(
      `SELECT ${userColumns} FROM users ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    pool.query<{ total: number }>('SELECT count(*)::int AS total FROM users'),
  ]);
  return { items: items.rows, total: count.rows[0].total, limit, offset };
}

export async function getUser(id: number): Promise<User | null> {
  const { rows } = await pool.query<User>(`SELECT ${userColumns} FROM users WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createUser(input: UserCreateInput): Promise<User> {
  const { rows } = await pool.query<User>(
    `INSERT INTO users (full_name, phone, email, linkedin_url)
     VALUES ($1, $2, $3, $4)
     RETURNING ${userColumns}`,
    [input.fullName, input.phone, input.email, input.linkedinUrl ?? null],
  );
  return rows[0];
}

export async function updateUser(id: number, input: UserUpdateInput): Promise<User | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [field, column] of Object.entries(updatableColumns)) {
    const value = input[field as keyof UserUpdateInput];
    if (value === undefined) continue;
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  }
  if (sets.length === 0) return getUser(id);

  values.push(id);
  const { rows } = await pool.query<User>(
    `UPDATE users
     SET ${sets.join(', ')}, updated_at = now()
     WHERE id = $${values.length}
     RETURNING ${userColumns}`,
    values,
  );
  return rows[0] ?? null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
