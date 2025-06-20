import { APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../response';

export const createErrorResponse = (
  statusCode: number,
  message: string,
  details?: any
): APIGatewayProxyResult =>
  createResponse(statusCode, {
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  });
