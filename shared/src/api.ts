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

export interface ApiError {
  error: string;
  details?: unknown;
}
