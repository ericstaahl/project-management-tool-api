import fastify from 'fastify';
import { getProjects, createProject } from './controllers/project_controller';
import cors from '@fastify/cors';

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

server.get('/', async (request, reply) => {
  return { hello: 'hi' };
});

server.get('/projects', async (request, reply) => {
  reply.send(await getProjects());
});

server.post('/projects', async (request, reply) => {
  console.log(request);
  if (request.body) reply.send(await createProject(request.body));
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
