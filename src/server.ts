import fastify from 'fastify';
import cors from '@fastify/cors';
import autoLoad from '@fastify/autoload';
import path from 'path';

const server = fastify({ logger: true });

server.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === 'localhost') {
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
