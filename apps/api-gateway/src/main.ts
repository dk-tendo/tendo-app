import fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import loadAllRoutes from './all-routes';

const app = fastify({ logger: true });
app.register(loadAllRoutes);

export const handler = awsLambdaFastify(app);
