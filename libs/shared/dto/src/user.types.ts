export interface UserSchema {
  email: string;
  firstName: string;
  lastName: string;
  id?: string;
  role?: 'doctor' | 'patient';
  patientIds?: string[];
  createdAt?: string;
  updatedAt?: string;
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
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserResponse {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  patient_ids?: string[];
  created_at: Date;
  updated_at: Date;
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
