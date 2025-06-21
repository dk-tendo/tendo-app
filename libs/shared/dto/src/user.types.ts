export interface UserSchema {
  id: string;
  email: string;
  role: 'doctor' | 'patient';
  patientIds?: string[];
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserValidationErrors {
  name?: string;
  email?: string;
  age?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
}
