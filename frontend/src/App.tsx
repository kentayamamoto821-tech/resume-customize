import { useEffect, useState } from 'react';
import { THEMES, type HealthResponse } from '@resume/shared';
import { apiGet } from './api';

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<HealthResponse>('/health').then(setHealth, (e: Error) => setError(e.message));
  }, []);

  return (
    <main>
      <h1>Resume Customizer</h1>
      <section>
        <h2>Backend status</h2>
        {error && <p>Error: {error}</p>}
        {health && (
          <p>
            API: {health.status} · DB: {health.db ? 'connected' : 'unreachable'}
          </p>
        )}
        {!health && !error && <p>Checking…</p>}
      </section>
      <section>
        <h2>Available themes</h2>
        <ul>
          {THEMES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
