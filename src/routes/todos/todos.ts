import { todo } from '@prisma/client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import {
    getTodos,
    addTodo,
    updateTodo,
    getTodo,
    deleteTodo,
    GetTodoRequest,
    AddTodoRequst,
    DeleteTodoRequest,
    GetTodosRequest,
    UpdateTodoRequest,
} from '../../controllers/todo_controller';
import { AddTodo, UpdateTodo } from '../../schemas/todo_schema';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
    fastify.get(
        '/:id',
        {
            preHandler: [verifyAccessToken<GetTodosRequest>],
        },
        getTodos
    );

    fastify.get(
        '/:id/:todoId',
        {
            preHandler: [verifyAccessToken<GetTodoRequest>],
        },
        getTodo
    );

    fastify.post(
        '/:id',
        {
            preHandler: [verifyAccessToken<AddTodoRequst>],
        },
        addTodo
    );

    fastify.put(
        '/:id/:todoId',
        {
            preHandler: [verifyAccessToken<UpdateTodoRequest>],
        },
        updateTodo
    );

    fastify.delete(
        '/:id/:todoId',
        {
            preHandler: [verifyAccessToken<DeleteTodoRequest>],
        },
        deleteTodo
    );
}
