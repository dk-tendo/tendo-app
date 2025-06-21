import {
  UserResponse,
  CreateUserValidationErrors,
  UserSchema,
} from '@tendo-app/shared-dto';
import { UserRepository } from '@tendo-app/shared-database';

export class UserService {
  static validateCreateUserRequest(data: UserSchema): {
    isValid: boolean;
    errors: CreateUserValidationErrors;
  } {
    const errors: CreateUserValidationErrors = {};

    // Name validation
    const nameFields = [
      { value: data.firstName, label: 'First name' },
      { value: data.lastName, label: 'Last name' },
    ];

    for (const field of nameFields) {
      if (!field.value || typeof field.value !== 'string') {
        errors.name = `${field.label} is required and must be a string`;
        break;
      }
      const length = field.value.trim().length;
      if (length < 2) {
        errors.name = `${field.label} must be at least 2 characters long`;
        break;
      }
      if (length > 100) {
        errors.name = `${field.label} must be less than 100 characters`;
        break;
      }
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

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Create a new user
  static async createUser(userData: UserSchema): Promise<UserSchema> {
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
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        role: userData.role || 'patient',
        patientIds: userData.patientIds || [],
      });

      // Transform to response format
      return this.transformUserToResponse(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserSchema | null> {
    try {
      const user = await UserRepository.findById(id);
      return user ? this.transformUserToResponse(user) : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<UserSchema | null> {
    const user = await UserRepository.findByEmail(email);
    return user ? this.transformUserToResponse(user) : null;
  }

  // Get all users
  static async getAllUsers(limit = 50, offset = 0): Promise<UserSchema[]> {
    try {
      const users = await UserRepository.findAll(limit, offset);
      return users.map((user) => this.transformUserToResponse(user));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Transform database user to response format
  private static transformUserToResponse(user: UserResponse): UserSchema {
    return {
      id: user.id || '',
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role as 'doctor' | 'patient' | undefined,
      patientIds: user.patient_ids || [],
      createdAt: user.created_at?.toISOString(),
      updatedAt: user.updated_at?.toISOString(),
    };
  }

  // Initialize database
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
