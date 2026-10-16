export interface HealthResponse {
  status: 'ok' | 'degraded';
  db: boolean;
  time: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/** A problem with one input field; `path` points at the field, e.g. ["email"]. */
export interface ApiIssue {
  path: (string | number)[];
  message: string;
}

export interface ApiError {
  error: string;
  details?: ApiIssue[];
}
