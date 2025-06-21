import { getClient } from './database.connection';
import { User, CreateUserRequest } from '@tendo-app/shared-dto';
const crypto = require('crypto');

export class UserRepository {
  // Create the users table if it doesn't exist
  static async createTable(): Promise<void> {
    const client = await getClient();

    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          age INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
      `;

      await client.query(createTableQuery);
      console.log('Users table created or already exists');
    } finally {
      client.release();
    }
  }

  // Create a new user
  static async create(userData: CreateUserRequest): Promise<User> {
    const client = await getClient();

    try {
      const id = crypto.randomUUID();
      const now = new Date();

      const query = `
        INSERT INTO users (id, name, email, age, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [
        id,
        userData.name,
        userData.email,
        userData.age || null,
        now,
        now,
      ];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Failed to create user');
      }

      return result.rows[0] as User;
    } finally {
      client.release();
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const client = await getClient();

    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);

      return result.rows.length > 0 ? (result.rows[0] as User) : null;
    } finally {
      client.release();
    }
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    const client = await getClient();

    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);

      return result.rows.length > 0 ? (result.rows[0] as User) : null;
    } finally {
      client.release();
    }
  }

  // Get all users with pagination
  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    const client = await getClient();

    try {
      const query = `
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await client.query(query, [limit, offset]);
      return result.rows as User[];
    } finally {
      client.release();
    }
  }

  // Update user
  static async update(
    id: string,
    updates: Partial<CreateUserRequest>
  ): Promise<User | null> {
    const client = await getClient();

    try {
      const fields = Object.keys(updates);
      const values = Object.values(updates);

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');
      const query = `
        UPDATE users
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;

      const result = await client.query(query, [id, ...values]);
      return result.rows.length > 0 ? (result.rows[0] as User) : null;
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
