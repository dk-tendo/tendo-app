/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyResult } from 'aws-lambda';
import { getCorsHeaders } from './cors.utils';
const crypto = require('crypto');

export const createResponse = (
  statusCode: number,
  body: any,
  additionalHeaders?: Record<string, string>
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...getCorsHeaders(),
    'X-Request-ID': crypto.randomUUID(),
    ...additionalHeaders,
  },
  body: JSON.stringify(body),
});
