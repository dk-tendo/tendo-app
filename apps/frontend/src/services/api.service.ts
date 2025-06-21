import { configService } from '../config/api.config';
import { RequestConfig } from '@tendo-app/shared-dto';

export class BaseApiService {
  protected async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const config = configService.getConfig();
    const url = `${config.baseURL}${endpoint}`;

    const {
      timeout = config.timeout,
      retries = config.retries,
      ...fetchOptions
    } = options;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const requestOptions: RequestInit = {
      ...defaultOptions,
      ...fetchOptions,
      headers: {
        ...defaultOptions.headers,
        ...fetchOptions.headers,
      },
    };

    return this.executeWithRetry(url, requestOptions, retries, timeout);
  }

  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number,
    timeout: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.executeRequest<T>(url, options, timeout);
      } catch (error) {
        lastError = error as Error;

        if (attempt === retries) {
          break;
        }

        // Only retry on network errors or 5xx status codes
        if (this.shouldRetry(error as Error)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    throw lastError!;
  }

  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        ) as any;
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if ((error as Error).name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw error;
    }
  }

  private shouldRetry(error: Error): boolean {
    const retryableErrors = ['TypeError', 'NetworkError'];
    const retryableStatuses = [500, 502, 503, 504];

    if (retryableErrors.includes(error.name)) {
      return true;
    }

    const status = (error as any).status;
    return status && retryableStatuses.includes(status);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}
