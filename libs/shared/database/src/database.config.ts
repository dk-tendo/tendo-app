import { DatabaseConfig } from '@tendo-app/shared-dto';

export const getDatabaseConfig = (): DatabaseConfig => {
  const config = {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    user: process.env['DB_USERNAME'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_NAME'] || 'myapp',
    ssl: process.env['DB_HOST']?.includes('amazonaws.com')
      ? { rejectUnauthorized: false }
      : false,
  };

  return config;
};
