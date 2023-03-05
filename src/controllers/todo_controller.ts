import { Prisma, todo } from '@prisma/client';
import { AddTodo } from '../schemas/todo_schema';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import prisma from '../prisma';
import getUserFromJwt from '../utilities/getUserFromJwt';

type AddTodoRequst = FastifyRequest<{
    Body: AddTodo;
    Params: { id: string };
}>;

type GetTodoRequest = FastifyRequest<{
    Params: { id: string };
    Querystring: {
        sortRule: 'title' | 'estimate';
        statusFilter: todo['status'];
        sortOrder: 'asc' | 'desc';
    };
}>;

export async function getTodos(request: GetTodoRequest, reply: FastifyReply) {
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

export async function addTodo(request: AddTodoRequst, reply: FastifyReply) {
    const data = request.body;
    const { id: projectId } = request.params;

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
            ...data,
            project_id: Number(projectId),
        };

        return reply.send(await prisma.todo.create({ data: dataToSave }));
    }
}
