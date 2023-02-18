import { todo } from '@prisma/client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { getTodos, addTodo } from '../../controllers/todo_controller';
import { AddTodo } from '../../schemas/todo_schema';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
    fastify.get(
        '/:id',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Params: { id: string };
                        Querystring: {
                            sortRule: 'title' | 'estimate' | todo['status'];
                        };
                    }>
                >,
            ],
        },
        getTodos
    );

    fastify.post(
        '/:id',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Body: AddTodo;
                        Params: { id: string };
                    }>
                >,
            ],
        },
        addTodo
    );
}
