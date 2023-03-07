import { todo } from '@prisma/client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import {
    getTodos,
    addTodo,
    updateTodo,
    getTodo,
    deleteTodo,
} from '../../controllers/todo_controller';
import { AddTodo, UpdateTodo } from '../../schemas/todo_schema';
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
                            sortOrder: 'asc' | 'desc';
                        };
                    }>
                >,
            ],
        },
        getTodos
    );

    fastify.get(
        '/:id/:todoId',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Params: { id: string; todoId: string };
                    }>
                >,
            ],
        },
        getTodo
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

    fastify.put(
        '/:id/:todoId',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Body: UpdateTodo;
                        Params: { id: string; todoId: string };
                    }>
                >,
            ],
        },
        updateTodo
    );

    fastify.delete(
        '/:id/:todoId',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Params: { id: string; todoId: string };
                    }>
                >,
            ],
        },
        deleteTodo
    );
}
