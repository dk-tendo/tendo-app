import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserService } from '@tendo-app/shared-services';
import { ApiResponse, UserSchema } from '@tendo-app/shared-dto';
import { randomUUID } from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const createResponse = (
  statusCode: number,
  body: ApiResponse,
  additionalHeaders?: Record<string, string>
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders,
    'X-Request-ID': randomUUID(),
    ...additionalHeaders,
  },
  body: JSON.stringify(body),
});

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = randomUUID();

  console.log('=== CREATE USER LAMBDA START ===');
  console.log('Request ID:', requestId);
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return createResponse(200, {
      success: true,
      message: 'CORS preflight handled',
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      console.log('Method not allowed:', event.httpMethod);
      return createResponse(405, {
        success: false,
        error: 'Method not allowed',
        message: 'Only POST requests are allowed for this endpoint',
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Parse request body
    let requestBody: UserSchema;
    try {
      if (!event.body) {
        throw new Error('Request body is required');
      }
      requestBody = JSON.parse(event.body);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return createResponse(400, {
        success: false,
        error: 'Invalid JSON in request body',
        message: 'Please provide valid JSON data',
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Initialize database (ensure tables exist)
    try {
      await UserService.initializeDatabase();
    } catch (dbInitError) {
      console.error('Database initialization error:', dbInitError);
      return createResponse(500, {
        success: false,
        error: 'Database initialization failed',
        message: 'Unable to initialize database connection',
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Create user
    try {
      console.log('Creating user with data:', requestBody);
      const user = await UserService.createUser(requestBody);

      console.log('User created successfully:', user);

      return createResponse(201, {
        success: true,
        data: user,
        message: 'User created successfully',
        timestamp: new Date().toISOString(),
        requestId,
      });
    } catch (serviceError: any) {
      console.error('Service error:', serviceError);

      // Handle validation errors
      if (serviceError.message.includes('Validation failed')) {
        return createResponse(400, {
          success: false,
          error: 'Validation error',
          message: serviceError.message,
          timestamp: new Date().toISOString(),
          requestId,
        });
      }

      // Handle duplicate email error
      if (serviceError.message.includes('already exists')) {
        return createResponse(409, {
          success: false,
          error: 'Conflict',
          message: serviceError.message,
          timestamp: new Date().toISOString(),
          requestId,
        });
      }

      // Handle database errors
      if (serviceError.code === '23505') {
        // PostgreSQL unique violation
        return createResponse(409, {
          success: false,
          error: 'Conflict',
          message: 'User with this email already exists',
          timestamp: new Date().toISOString(),
          requestId,
        });
      }

      throw serviceError;
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);

    return createResponse(500, {
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while creating the user',
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
};
