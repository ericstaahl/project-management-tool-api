import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import autoLoad from '@fastify/autoload';
import path from 'path';
import * as dotenv from 'dotenv';
import fastifyAuth from '@fastify/auth';
import fastifyJwt from '@fastify/jwt';

dotenv.config();

export const server = fastify({ logger: true });

const ALLOWED_HOSTNAME = process.env.ALLOWED_HOSTNAME;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === ALLOWED_HOSTNAME) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  },
});

if (ACCESS_TOKEN_SECRET) {
  server.register(fastifyJwt, { secret: ACCESS_TOKEN_SECRET });
} else {
  console.error('No access token secret provided. Check env variables.');
  process.exit(1);
}
server.register(fastifyAuth);

server.decorate(
  'verifyJwt',
  async (request: FastifyRequest, reply: FastifyReply, done: any) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  }
);

server.register(autoLoad, {
  dir: path.join(__dirname, 'routes'),
});

const start = async () => {
  try {
    await server.listen({ port: 3001 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
