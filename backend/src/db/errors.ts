// Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
const UNIQUE_VIOLATION = '23505';

interface PgError {
  code: string;
  constraint?: string;
}

function isPgError(err: unknown): err is PgError {
  return (
    typeof err === 'object' && err !== null && typeof (err as { code?: unknown }).code === 'string'
  );
}

export function isUniqueViolation(err: unknown, constraint?: string): boolean {
  return (
    isPgError(err) &&
    err.code === UNIQUE_VIOLATION &&
    (constraint === undefined || err.constraint === constraint)
  );
}
