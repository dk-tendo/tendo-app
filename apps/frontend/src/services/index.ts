import { UserService } from './user.service';
import { configService } from '../config/api.config';

class ApiService {
  public readonly users: UserService;

  constructor() {
    this.users = new UserService();
  }

  getCurrentConfig() {
    return configService.getConfig();
  }

  async testConnection(): Promise<boolean> {
    return configService.testConnection();
  }

  changeApiUrl(newUrl: string) {
    configService.setConfig({ baseURL: newUrl });
  }

  isLocalEnvironment(): boolean {
    const config = this.getCurrentConfig();
    return config.baseURL.includes('localhost');
  }
}

export const apiService = new ApiService();
export default apiService;

export { UserService };
