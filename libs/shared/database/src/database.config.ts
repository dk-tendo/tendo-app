import { DatabaseConfig } from '@tendo-app/shared-dto';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

if (!isBrowser && !process.env['DB_HOST']) {
  try {
    require('dotenv').config();
    console.log('📋 Environment variables loaded from .env file');
  } catch (error) {
    console.warn('⚠️ Could not load dotenv (this is normal in production)');
  }
}

export const getDatabaseConfig = (): DatabaseConfig => {
  // In browser environment, return a default config or throw an error
  if (isBrowser) {
    throw new Error(
      'Database configuration is not available in browser environment'
    );
  }

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
