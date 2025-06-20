import { FastifyInstance, FastifyPluginAsync } from 'fastify';

export const app: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(import('@fastify/cors'), {
    origin: process.env['CORS_ORIGIN'] || '*',
    credentials: true,
  });

  await fastify.register(import('./routes/root'), { prefix: '/' });

  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: error.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  });

  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });
};
