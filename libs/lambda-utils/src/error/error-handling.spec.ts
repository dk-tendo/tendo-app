import { APIGatewayProxyResult } from 'aws-lambda';
import { createErrorResponse } from './error-handling';
import { createResponse } from '../response';

// Mock the createResponse function
jest.mock('../response', () => ({
  createResponse: jest.fn(),
}));

const mockCreateResponse = createResponse as jest.MockedFunction<
  typeof createResponse
>;

describe('createErrorResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2025-01-20T12:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('basic error response creation', () => {
    it('should create error response with status code and message', () => {
      const statusCode = 400;
      const message = 'Bad Request';
      const expectedResponse: APIGatewayProxyResult = {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Bad Request',
          statusCode: 400,
          timestamp: '2025-01-20T12:00:00.000Z',
        }),
      };

      mockCreateResponse.mockReturnValue(expectedResponse);

      const result = createErrorResponse(statusCode, message);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Bad Request',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should create error response with details when provided', () => {
      const statusCode = 422;
      const message = 'Validation Error';
      const details = {
        field: 'email',
        reason: 'Invalid email format',
        code: 'INVALID_EMAIL',
      };
      const expectedResponse: APIGatewayProxyResult = {
        statusCode: 422,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Validation Error',
          statusCode: 422,
          timestamp: '2025-01-20T12:00:00.000Z',
          details: {
            field: 'email',
            reason: 'Invalid email format',
            code: 'INVALID_EMAIL',
          },
        }),
      };

      mockCreateResponse.mockReturnValue(expectedResponse);

      const result = createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(422, {
        error: 'Validation Error',
        statusCode: 422,
        timestamp: '2025-01-20T12:00:00.000Z',
        details: {
          field: 'email',
          reason: 'Invalid email format',
          code: 'INVALID_EMAIL',
        },
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('common HTTP error status codes', () => {
    it('should handle 400 Bad Request', () => {
      const statusCode = 400;
      const message = 'Invalid request format';

      createErrorResponse(statusCode, message);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Invalid request format',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });

    it('should handle 401 Unauthorized', () => {
      const statusCode = 401;
      const message = 'Authentication required';

      createErrorResponse(statusCode, message);

      expect(mockCreateResponse).toHaveBeenCalledWith(401, {
        error: 'Authentication required',
        statusCode: 401,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });

    it('should handle 403 Forbidden', () => {
      const statusCode = 403;
      const message = 'Access denied';
      const details = { resource: 'user-profile', action: 'update' };

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(403, {
        error: 'Access denied',
        statusCode: 403,
        timestamp: '2025-01-20T12:00:00.000Z',
        details: { resource: 'user-profile', action: 'update' },
      });
    });

    it('should handle 404 Not Found', () => {
      const statusCode = 404;
      const message = 'Resource not found';
      const details = { resourceId: '12345', resourceType: 'user' };

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(404, {
        error: 'Resource not found',
        statusCode: 404,
        timestamp: '2025-01-20T12:00:00.000Z',
        details: { resourceId: '12345', resourceType: 'user' },
      });
    });

    it('should handle 500 Internal Server Error', () => {
      const statusCode = 500;
      const message = 'Internal server error';
      const details = { errorId: 'ERR_001', stack: 'Error stack trace...' };

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(500, {
        error: 'Internal server error',
        statusCode: 500,
        timestamp: '2025-01-20T12:00:00.000Z',
        details: { errorId: 'ERR_001', stack: 'Error stack trace...' },
      });
    });
  });

  describe('edge cases and special scenarios', () => {
    it('should handle empty message', () => {
      const statusCode = 400;
      const message = '';

      createErrorResponse(statusCode, message);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: '',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });

    it('should handle null details (should not include details in response)', () => {
      const statusCode = 400;
      const message = 'Bad Request';
      const details = null;

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Bad Request',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });

    it('should handle undefined details (should not include details in response)', () => {
      const statusCode = 400;
      const message = 'Bad Request';

      createErrorResponse(statusCode, message, undefined);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Bad Request',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });

    it('should handle empty object as details', () => {
      const statusCode = 400;
      const message = 'Bad Request';
      const details = {};

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Bad Request',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
        details: {},
      });
    });

    it('should handle complex nested details object', () => {
      const statusCode = 422;
      const message = 'Validation Error';
      const details = {
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password too short' },
        ],
        metadata: {
          requestId: 'req-123',
          validationRules: ['email', 'password'],
        },
      };

      createErrorResponse(statusCode, message, details);

      expect(mockCreateResponse).toHaveBeenCalledWith(422, {
        error: 'Validation Error',
        statusCode: 422,
        timestamp: '2025-01-20T12:00:00.000Z',
        details,
      });
    });

    it('should handle non-standard status codes', () => {
      const statusCode = 418; // I'm a teapot
      const message = "I'm a teapot";

      createErrorResponse(statusCode, message);

      expect(mockCreateResponse).toHaveBeenCalledWith(418, {
        error: "I'm a teapot",
        statusCode: 418,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
    });
  });

  describe('timestamp functionality', () => {
    it('should include current timestamp in ISO format', () => {
      const mockTimestamp = '2025-01-20T15:30:45.123Z';
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockTimestamp);

      createErrorResponse(400, 'Test error');

      expect(mockCreateResponse).toHaveBeenCalledWith(400, {
        error: 'Test error',
        statusCode: 400,
        timestamp: mockTimestamp,
      });
    });

    it('should create new timestamp for each call', () => {
      const timestamps = [
        '2025-01-20T12:00:00.000Z',
        '2025-01-20T12:00:01.000Z',
      ];
      let callCount = 0;
      jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => {
        return timestamps[callCount++] || timestamps[0];
      });

      createErrorResponse(400, 'First error');
      createErrorResponse(500, 'Second error');

      expect(mockCreateResponse).toHaveBeenNthCalledWith(1, 400, {
        error: 'First error',
        statusCode: 400,
        timestamp: '2025-01-20T12:00:00.000Z',
      });
      expect(mockCreateResponse).toHaveBeenNthCalledWith(2, 500, {
        error: 'Second error',
        statusCode: 500,
        timestamp: '2025-01-20T12:00:01.000Z',
      });
    });
  });

  describe('integration with createResponse', () => {
    it('should return whatever createResponse returns', () => {
      const expectedResponse: APIGatewayProxyResult = {
        statusCode: 400,
        headers: { 'Custom-Header': 'value' },
        body: '{"custom":"response"}',
      };
      mockCreateResponse.mockReturnValue(expectedResponse);

      const result = createErrorResponse(400, 'Test error');

      expect(result).toBe(expectedResponse);
    });

    it('should handle when createResponse throws an error', () => {
      mockCreateResponse.mockImplementation(() => {
        throw new Error('createResponse failed');
      });

      expect(() => createErrorResponse(400, 'Test error')).toThrow(
        'createResponse failed'
      );
    });
  });

  describe('type safety', () => {
    it('should return APIGatewayProxyResult type', () => {
      const expectedResponse: APIGatewayProxyResult = {
        statusCode: 400,
        headers: {},
        body: '{}',
      };
      mockCreateResponse.mockReturnValue(expectedResponse);

      const result = createErrorResponse(400, 'Test');

      expect(typeof result.statusCode).toBe('number');
      expect(typeof result.body).toBe('string');
      expect(typeof result.headers).toBe('object');
    });
  });
});
