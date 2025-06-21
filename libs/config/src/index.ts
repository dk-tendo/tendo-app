interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

class ConfigService {
  private config: ApiConfig | null = null;

  // Auto-detect API URL based on current environment
  private detectApiUrl(): string {
    const hostname = window.location.hostname;

    // Development environments
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }

    // Production environment - replace with your actual API endpoint
    if (hostname === 'drh3lhlsbyvln.cloudfront.net') {
      return 'https://vwnoutyxti.execute-api.us-east-1.amazonaws.com/prod';
    }

    // Fallback to production API
    console.warn('Unknown environment, using fallback API URL');
    return 'https://vwnoutyxti.execute-api.us-east-1.amazonaws.com/prod';
  }

  // Get configuration with caching
  getConfig(): ApiConfig {
    if (!this.config) {
      this.config = {
        baseURL: this.detectApiUrl(),
        timeout: 10000,
        retries: 3,
      };

      console.log('🔧 API Configuration detected:', this.config);
    }

    return this.config;
  }

  // Override for testing or manual configuration
  setConfig(config: Partial<ApiConfig>): void {
    this.config = {
      ...this.getConfig(),
      ...config,
    };
  }

  // Test if API is reachable
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getConfig().baseURL}/test`, {
        method: 'GET',
        // timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const configService = new ConfigService();
export default configService;
