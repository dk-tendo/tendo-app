import fastify from 'fastify';
import loadAllRoutes from './all-routes';

const server = fastify({ logger: true });

const start = async () => {
  await server.register(loadAllRoutes);
  await server.listen({ port: 3000 });
  console.log('Local server: http://localhost:3000');
};

start();
