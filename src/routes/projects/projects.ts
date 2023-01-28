import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  getProjects,
  createProject,
} from '../../controllers/project_controller';
import { AddProject } from '../../schemas/project_schema';
import { server } from '../../server';

const checkUser = (
  req: FastifyRequest<{
    Body: AddProject;
  }>,
  reply: FastifyReply,
  next: any
) => {
  server.verifyJwt(req, reply);
  next();
};

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [server.verifyJwt] }, getProjects);
  fastify.post('/', { preHandler: [checkUser] }, createProject);
}
