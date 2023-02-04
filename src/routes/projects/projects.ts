import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  getProjects,
  createProject,
} from '../../controllers/project_controller';
import { AddProject } from '../../schemas/project_schema';
import { server } from '../../server';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [server.verifyJwt] }, getProjects);
  fastify.post(
    '/',
    {
      preHandler: [
        verifyAccessToken<
          FastifyRequest<{
            Body: AddProject;
          }>
        >,
      ],
    },
    createProject
  );
}
