export interface HealthResponse {
  status: 'ok' | 'degraded';
  db: boolean;
  time: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
