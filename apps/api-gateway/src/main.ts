import fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import cors from '@fastify/cors';
import loadAllRoutes from './all-routes';

const app = fastify({ logger: true });

app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
});

// Register routes
app.register(loadAllRoutes);

// AWS Lambda handler
export const handler = awsLambdaFastify(app, {
  decorateRequest: false,
  binaryMimeTypes: ['application/octet-stream', 'image/*'],
});
