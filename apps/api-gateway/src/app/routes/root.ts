import { FastifyInstance } from 'fastify';

export default async function root(fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });

  // --- TODO: handlers ---
}
