export const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': process.env['CORS_ORIGIN'] || '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
});

export const createCorsPreflightResponse = (
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE']
) => ({
  statusCode: 200,
  headers: {
    ...getCorsHeaders(),
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Max-Age': '86400',
  },
  body: '',
});
