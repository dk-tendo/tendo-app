import {
  CreateUserRequest,
  User,
  UserResponse,
  CreateUserValidationErrors,
} from '@tendo-app/shared-dto';
import { UserRepository } from '@tendo-app/shared-database';

export class UserService {
  // Validate user input
  static validateCreateUserRequest(data: any): {
    isValid: boolean;
    errors: CreateUserValidationErrors;
  } {
    const errors: CreateUserValidationErrors = {};

    // Name validation
    if (!data.name || typeof data.name !== 'string') {
      errors.name = 'Name is required and must be a string';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (data.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!data.email || typeof data.email !== 'string') {
      errors.email = 'Email is required and must be a string';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Email must be a valid email address';
      }
    }

    // Age validation (optional)
    if (data.age !== undefined && data.age !== null) {
      if (typeof data.age !== 'number' || !Number.isInteger(data.age)) {
        errors.age = 'Age must be a valid integer';
      } else if (data.age < 0 || data.age > 150) {
        errors.age = 'Age must be between 0 and 150';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Create a new user
  static async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      // Validate input
      const validation = this.validateCreateUserRequest(userData);
      if (!validation.isValid) {
        throw new Error(
          `Validation failed: ${JSON.stringify(validation.errors)}`
        );
      }

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user
      const user = await UserRepository.create({
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        age: userData.age,
      });

      // Transform to response format
      return this.transformUserToResponse(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await UserRepository.findById(id);
      return user ? this.transformUserToResponse(user) : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get all users
  static async getAllUsers(limit = 50, offset = 0): Promise<UserResponse[]> {
    try {
      const users = await UserRepository.findAll(limit, offset);
      return users.map((user) => this.transformUserToResponse(user));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Transform database user to response format
  private static transformUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    };
  }

  // Initialize database (create tables)
  static async initializeDatabase(): Promise<void> {
    try {
      await UserRepository.createTable();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
}
