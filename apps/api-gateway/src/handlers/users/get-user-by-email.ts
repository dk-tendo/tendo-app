import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { UserService } from '@tendo-app/shared-services';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = randomUUID();

  console.log('=== GET USERS LAMBDA START ===');
  console.log('Request ID:', requestId);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed',
          timestamp: new Date().toISOString(),
          requestId,
        }),
      };
    }

    const users = await UserService.getUserByEmail(
      event.pathParameters?.email as string
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: users,
        message: 'Users retrieved successfully',
        timestamp: new Date().toISOString(),
        requestId,
      }),
    };
  } catch (error: any) {
    console.error('Error getting users:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve users',
        timestamp: new Date().toISOString(),
        requestId,
      }),
    };
  }
};
