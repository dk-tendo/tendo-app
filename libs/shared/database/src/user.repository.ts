import { getClient } from './database.connection';
import {
  User,
  UserSchema,
  TableGenerator,
  QueryBuilder,
} from '@tendo-app/shared-dto';

export class UserRepository {
  // Create the users table if it doesn't exist
  static async createTable(): Promise<void> {
    const client = await getClient();

    try {
      const createTableQuery =
        TableGenerator.generateCreateTableQuery(UserSchema);
      console.log('Generated query:', createTableQuery);

      await client.query(createTableQuery);
      console.log('Users table created or already exists');
    } finally {
      client.release();
    }
  }

  // Create a new user
  static async create(userData: User): Promise<UserSchema> {
    const client = await getClient();

    try {
      // Add auto-generated fields
      const dataWithDefaults = {
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role || 'patient',
        patient_ids: userData.patientIds,
        image_url: userData.imageUrl,
        clinic_id: userData.clinicId,
        incomplete_task_ids: userData.incompleteTaskIds,
        completed_task_ids: userData.completedTaskIds,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const { query, values } = QueryBuilder.buildInsertQuery(
        'users',
        dataWithDefaults
      );

      console.log('Generated query:', query);
      console.log('Values:', values);

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Failed to create user');
      }

      return result.rows[0] as UserSchema;
    } finally {
      client.release();
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<UserSchema | null> {
    const client = await getClient();

    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);

      return result.rows.length > 0 ? (result.rows[0] as UserSchema) : null;
    } finally {
      client.release();
    }
  }

  // Find user by ID
  static async findById(id: string): Promise<UserSchema | null> {
    const client = await getClient();

    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);

      return result.rows.length > 0 ? (result.rows[0] as UserSchema) : null;
    } finally {
      client.release();
    }
  }

  // Get all users with pagination
  static async findAll(limit = 50, offset = 0): Promise<UserSchema[]> {
    const client = await getClient();

    try {
      const query = `
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await client.query(query, [limit, offset]);
      return result.rows as UserSchema[];
    } finally {
      client.release();
    }
  }

  // Update user
  static async update(
    id: string,
    updates: Partial<User>
  ): Promise<UserSchema | null> {
    const client = await getClient();

    try {
      // Convert camelCase to snake_case for database
      const dbUpdates = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        role: updates.role,
        patient_ids: updates.patientIds,
        image_url: updates.imageUrl,
        clinic_id: updates.clinicId,
        incomplete_task_ids: updates.incompleteTaskIds,
        completed_task_ids: updates.completedTaskIds,
      };

      const { query, values } = QueryBuilder.buildUpdateQuery(
        'users',
        id,
        dbUpdates
      );

      const result = await client.query(query, values);
      return result.rows.length > 0 ? (result.rows[0] as UserSchema) : null;
    } finally {
      client.release();
    }
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const client = await getClient();

    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await client.query(query, [id]);

      return result.rowCount != null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}
