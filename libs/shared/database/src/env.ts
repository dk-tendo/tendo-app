import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('Failed to load .env file:', result.error.message);
} else {
  console.log('✅ Environment variables loaded successfully');
}
