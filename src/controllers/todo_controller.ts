import { Prisma, todo } from '@prisma/client';
import {
    AddTodo,
    AddTodoSchema,
    UpdateTodoSchema,
    UpdateTodo,
    AddTodoComment,
    AddTodoCommentSchema,
} from '../schemas/todo_schema';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import prisma from '../prisma';
import getUserFromJwt from '../utilities/getUserFromJwt';
import checkUserAccess from '../utilities/checkUserAccess';

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
                include: {
                    todo_comment: {
                        include: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
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
                await checkUserAccess(userInfo.user.user_id, Number(projectId));
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        } else
            reply.status(401).send({
                message: `You don't have access to this project.`,
            });

        const dataToSave: Prisma.todoUncheckedCreateInput = {
            ...parsedData,
            project_id: Number(projectId),
        };

        return reply.send(await prisma.todo.create({ data: dataToSave }));
    }
}

export async function updateTodo(
    request: UpdateTodoRequest,
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
                await checkUserAccess(userInfo.user.user_id, Number(projectId));
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        } else
            reply.status(401).send({
                message: `You don't have access to this project.`,
            });

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
    request: DeleteTodoRequest,
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
                await checkUserAccess(userInfo.user.user_id, Number(projectId));
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        } else
            reply.status(401).send({
                message: `You don't have access to this project.`,
            });

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

export async function addTodoComment(
    request: AddTodoCommentRequest,
    reply: FastifyReply
) {
    const todoId = Number(request.params.todoId);
    const parsedData = AddTodoCommentSchema.parse(request.body);

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
                const { project_id } = await prisma.todo.findFirstOrThrow({
                    where: {
                        todo_id: todoId,
                    },
                    select: {
                        project_id: true,
                    },
                });
                await checkUserAccess(userInfo.user.user_id, project_id);
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        } else
            reply.status(401).send({
                message: `You don't have access to this project.`,
            });

        if (userInfo?.user.user_id) {
            const dataToSave: Prisma.todo_commentUncheckedCreateInput = {
                ...parsedData,
                todo_id: todoId,
                user_id: userInfo.user.user_id,
            };
            return reply.send(
                await prisma.todo_comment.create({
                    data: dataToSave,
                })
            );
        }
    }
}

export async function deleteTodoComment(
    request: DeleteCommentRequest,
    reply: FastifyReply
) {
    const { id: commentId } = request.params;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (userInfo?.user.user_id) {
            return reply.send(
                await prisma.todo_comment.deleteMany({
                    where: {
                        comment_id: Number(commentId),
                        user_id: userInfo.user.user_id,
                    },
                })
            );
        }
    }
}

export async function assignSelf(
    request: UpdateTodoRequest,
    reply: FastifyReply
) {
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
                await checkUserAccess(userInfo.user.user_id, projectId);
            } catch (err) {
                reply.status(401).send({
                    message: `You don't have access to this project.`,
                });
                throw err;
            }
        } else
            reply.status(401).send({
                message: `You don't have access to this project.`,
            });

        if (userInfo?.user.user_id) {
            return reply.send(
                await prisma.todo.updateMany({
                    data: {
                        assignee: userInfo.user.username,
                    },
                    where: { todo_id: todoId },
                })
            );
        }
    }
}

export type AddTodoRequst = FastifyRequest<{
    Body: AddTodo;
    Params: { id: string };
}>;

export type GetTodosRequest = FastifyRequest<{
    Params: { id: string };
    Querystring: {
        sortRule: 'title' | 'estimate';
        statusFilter: todo['status'];
        sortOrder: 'asc' | 'desc';
    };
}>;

export type GetTodoRequest = FastifyRequest<{
    Params: { id: string; todoId: string };
}>;

export type UpdateTodoRequest = FastifyRequest<{
    Body: UpdateTodo;
    Params: { id: string; todoId: string };
}>;

export type AssignSelfRequest = FastifyRequest<{
    Params: { id: string; todoId: string };
}>;

export type DeleteTodoRequest = FastifyRequest<{
    Params: { id: string; todoId: string };
}>;

export type AddTodoCommentRequest = FastifyRequest<{
    Body: AddTodoComment;
    Params: { todoId: string };
}>;

export type DeleteCommentRequest = FastifyRequest<{
    Params: { id: string };
}>;
