import { APIGatewayProxyEvent } from 'aws-lambda';

export const validateHttpMethod = (
  event: APIGatewayProxyEvent,
  allowedMethod: string | string[]
): boolean => {
  const eventMethod = event.httpMethod?.toUpperCase();

  if (!eventMethod) return false;

  const allowed = Array.isArray(allowedMethod)
    ? allowedMethod.map((method) => method.toUpperCase())
    : [allowedMethod.toUpperCase()];

  return allowed.includes(eventMethod);
};

export const validateHttpMethodWithCors = (
  event: APIGatewayProxyEvent,
  allowedMethods: string | string[]
): { isValid: boolean; isOptions: boolean } => {
  const eventMethod = event.httpMethod?.toUpperCase();

  if (!eventMethod) return { isValid: false, isOptions: false };

  if (eventMethod === 'OPTIONS') return { isValid: true, isOptions: true };

  const allowed = Array.isArray(allowedMethods)
    ? allowedMethods.map((method) => method.toUpperCase())
    : [allowedMethods.toUpperCase()];

  return {
    isValid: allowed.includes(eventMethod),
    isOptions: false,
  };
};
