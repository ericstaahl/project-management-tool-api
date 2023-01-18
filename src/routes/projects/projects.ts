import { FastifyRequest, FastifyInstance } from 'fastify';
import {
  getProjects,
  createProject,
} from '../../controllers/project_controller';
import { server } from '../../server';

interface Project {
  title: string;
  project_id?: number;
  number_of_members?: number;
  start_date: string;
  due_date: string;
  user_id: number;
}

type CreateProjectRequest = FastifyRequest<{
  Body: Project;
}>;

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [server.verifyJwt] }, getProjects);

  fastify.post('/', async (request: CreateProjectRequest, reply) => {
    if (request.body) reply.send(await createProject(request.body));
  });
}
