import { configService } from '@tendo-app/config';

export class AdminApiService {
  static async initializeDatabase(): Promise<{
    message: string;
    tables: string[];
  }> {
    try {
      const config = configService.getConfig();
      const response = await fetch(`${config.baseURL}/admin/init-database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
}
