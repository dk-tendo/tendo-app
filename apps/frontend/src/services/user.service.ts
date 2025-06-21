import { BaseApiService } from './api.service';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
} from '@tendo-app/shared-dto';

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UserService extends BaseApiService {
  private readonly basePath = '/users';

  async getUsers(
    params: GetUsersParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = this.buildQueryString(params);
    return this.request(`${this.basePath}${queryString}`);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`${this.basePath}/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request(`${this.basePath}`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    return this.request(`${this.basePath}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    const queryString = this.buildQueryString({ q: query });
    return this.request(`${this.basePath}/search${queryString}`);
  }
}
