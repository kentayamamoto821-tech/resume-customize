export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://resume:resume@localhost:5432/resume',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
