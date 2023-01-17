import fastify from 'fastify';
import cors from '@fastify/cors';
import autoLoad from '@fastify/autoload';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const server = fastify({ logger: true });

const allowedHostname = process.env.ALLOWED_HOSTNAME;

server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === allowedHostname) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  },
});

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
