import { Prisma, todo } from '@prisma/client';
import {
    AddTodo,
    AddTodoSchema,
    UpdateTodoSchema,
    UpdateTodo,
} from '../schemas/todo_schema';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import prisma from '../prisma';
import getUserFromJwt from '../utilities/getUserFromJwt';

type AddTodoRequst = FastifyRequest<{
    Body: AddTodo;
    Params: { id: string };
}>;

type GetTodosRequest = FastifyRequest<{
    Params: { id: string };
    Querystring: {
        sortRule: 'title' | 'estimate';
        statusFilter: todo['status'];
        sortOrder: 'asc' | 'desc';
    };
}>;

type GetTodoRequest = FastifyRequest<{
    Params: { id: string; todoId: string };
}>;

export async function getTodos(request: GetTodosRequest, reply: FastifyReply) {
    const projectId = Number(request.params.id);
    const sortRule = request.query['sortRule'];
    const statusFilter = request.query['statusFilter'];
    const sortOrder = request.query['sortOrder'];

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        // check if user has access to project
        if (userInfo?.user.user_id) {
            try {
                await prisma.project.findFirstOrThrow({
                    where: {
                        OR: [
                            {
                                members: {
                                    some: {
                                        user_id: {
                                            equals: userInfo.user.user_id,
                                        },
                                        project_id: { equals: projectId },
                                    },
                                },
                            },
                            {
                                user_id: userInfo.user.user_id,
                                project_id: projectId,
                            },
                        ],
                    },
                });
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        }

        return reply.send(
            await prisma.todo.findMany({
                where: {
                    project_id: Number(projectId),
                    status: statusFilter,
                },
                orderBy: {
                    [sortRule]: sortOrder,
                },
            })
        );
    }
}

export async function getTodo(request: GetTodoRequest, reply: FastifyReply) {
    const projectId = Number(request.params.id);
    const todoId = Number(request.params.todoId);
    console.log('todoId', todoId);

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        // check if user has access to project
        if (userInfo?.user.user_id) {
            try {
                await prisma.project.findFirstOrThrow({
                    where: {
                        OR: [
                            {
                                members: {
                                    some: {
                                        user_id: {
                                            equals: userInfo.user.user_id,
                                        },
                                        project_id: { equals: projectId },
                                    },
                                },
                            },
                            {
                                user_id: userInfo.user.user_id,
                                project_id: Number(projectId),
                            },
                        ],
                    },
                });
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        }

        return reply.send(
            await prisma.todo.findUnique({
                where: {
                    todo_id: todoId,
                },
            })
        );
    }
}

export async function addTodo(request: AddTodoRequst, reply: FastifyReply) {
    const { id: projectId } = request.params;

    const parsedData = AddTodoSchema.parse(request.body);

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        // check if user has access to project
        if (userInfo?.user.user_id) {
            try {
                await prisma.project.findFirstOrThrow({
                    where: {
                        project_id: Number(projectId),
                        user_id: userInfo.user.user_id,
                    },
                });
            } catch (err) {
                return reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
            }
        }

        const dataToSave: Prisma.todoUncheckedCreateInput = {
            ...parsedData,
            project_id: Number(projectId),
        };

        return reply.send(await prisma.todo.create({ data: dataToSave }));
    }
}

export async function updateTodo(
    request: FastifyRequest<{
        Body: UpdateTodo;
        Params: { id: string; todoId: string };
    }>,
    reply: FastifyReply
) {
    const parsedData = UpdateTodoSchema.parse(request.body);

    const projectId = Number(request.params.id);
    const todoId = Number(request.params.todoId);

    console.log('Request:', request);
    console.log('Reply:', reply);

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        // check if user has access to project
        if (userInfo?.user.user_id) {
            try {
                await prisma.project.findFirstOrThrow({
                    where: {
                        project_id: Number(projectId),
                        user_id: userInfo.user.user_id,
                    },
                });
            } catch (err) {
                return reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
            }
        }

        if (userInfo?.user.user_id) {
            return reply.send(
                await prisma.todo.updateMany({
                    data: parsedData,
                    where: { todo_id: todoId },
                })
            );
        }
    }
}

export async function deleteTodo(
    request: FastifyRequest<{
        Params: { id: string; todoId: string };
    }>,
    reply: FastifyReply
) {
    const projectId = Number(request.params.id);
    const todoId = Number(request.params.todoId);

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        // check if user has access to project
        if (userInfo?.user.user_id) {
            try {
                await prisma.project.findFirstOrThrow({
                    where: {
                        project_id: Number(projectId),
                        user_id: userInfo.user.user_id,
                    },
                });
            } catch (err) {
                return reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
            }
        }

        if (userInfo?.user.user_id) {
            return reply.send(
                await prisma.todo.deleteMany({
                    where: {
                        project_id: projectId,
                        todo_id: todoId,
                    },
                })
            );
        }
    }
}
