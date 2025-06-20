import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  createResponse,
  createErrorResponse,
  validateHttpMethodWithCors,
  createCorsPreflightResponse,
} from '@tendo-app/lambda-utils';

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { isValid, isOptions } = validateHttpMethodWithCors(event, 'GET');

    if (isOptions) {
      return createCorsPreflightResponse(['GET']);
    }

    if (!isValid) {
      return createErrorResponse(405, 'Method not allowed');
    }

    const response = {
      message: 'Hello from Lambda!!',
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('Handler error:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};
