import { Pool, PoolClient } from 'pg';
import { getDatabaseConfig } from './database.config';

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    const config = getDatabaseConfig();
    pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
      max: 20, // Maximum number of clients in the pool
      connectionTimeoutMillis: 30000, // 30 seconds
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
};

export const getClient = async (): Promise<PoolClient> => {
  const pool = getPool();
  return await pool.connect();
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
