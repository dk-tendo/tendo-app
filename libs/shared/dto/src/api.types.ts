/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}
