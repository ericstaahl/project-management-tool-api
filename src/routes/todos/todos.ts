import { FastifyRequest, FastifyInstance } from 'fastify';
import { getTodos } from '../../controllers/todo_controller';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/:id',
    async (
      request: FastifyRequest<{
        Params: { id: number };
      }>,
      reply
    ) => {
      const projectId = Number(request.params.id);
      reply.send(await getTodos(projectId));
    }
  );
}
