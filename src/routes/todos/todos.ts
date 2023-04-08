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
    addTodoComment,
    AddTodoCommentRequest,
    DeleteCommentRequest,
    deleteTodoComment,
} from '../../controllers/todo_controller';
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
    fastify.post(
        '/:todoId/comment',
        {
            preHandler: [verifyAccessToken<AddTodoCommentRequest>],
        },
        addTodoComment
    );
    fastify.delete(
        '/comment/:id',
        {
            preHandler: [verifyAccessToken<DeleteCommentRequest>],
        },
        deleteTodoComment
    );
}
