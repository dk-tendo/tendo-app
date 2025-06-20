import { FastifyInstance } from 'fastify';
import root from './app/routes/root';

export default async function loadAllRoutes(app: FastifyInstance) {
  root(app);
}
