import { UserRepository } from '@tendo-app/shared-database';

export const main = async (event) => {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('DB Host:', process.env.DB_HOST);

  // Only allow in development or with proper authentication
  if (process.env.NODE_ENV === 'production' && !isAuthorizedAdmin(event)) {
    return {
      statusCode: 403,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    console.log('Starting database initialization...');

    // Create tables
    await UserRepository.createTable();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Database initialized successfully',
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Database initialization failed',
        details: error.message,
        host: process.env.DB_HOST,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

function isAuthorizedAdmin(event): boolean {
  // For development, allow all
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // For production, implement proper auth
  // Example: Check for admin API key
  const apiKey = event.headers['x-admin-api-key'];
  return apiKey === process.env.ADMIN_API_KEY;

  // Or check JWT token for admin role
  // const token = event.headers.authorization;
  // return validateAdminToken(token);
}
