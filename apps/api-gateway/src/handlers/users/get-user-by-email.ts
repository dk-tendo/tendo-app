import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserService } from '@tendo-app/shared-services';
import { randomUUID } from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = randomUUID();

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

    const users = await UserService.getUserByEmail(event.pathParameters?.email);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: users,
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
        timestamp: new Date().toISOString(),
        requestId,
      }),
    };
  }
};
