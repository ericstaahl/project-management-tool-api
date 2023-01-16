import { Prisma } from '@prisma/client';
import { FastifyRequest, FastifyInstance } from 'fastify';
import { getTodos, addTodo } from '../../controllers/todo_controller';

type AddTodoRequst = FastifyRequest<{
  Body: Prisma.todoCreateManyInput;
}>;

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

  fastify.post('/:id', async (request: AddTodoRequst, reply) => {
    console.log(request.body);
    if (request.body) reply.send(await addTodo(request.body));
  });
}
