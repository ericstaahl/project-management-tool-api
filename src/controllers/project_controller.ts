import { AddProject, UpdateProject } from '../schemas/project_schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';
import getUserFromJwt from '../utilities/getUserFromJwt';

type GetProjectsRequest = FastifyRequest<{
    Querystring: {
        sortRule: 'due_date' | 'title' | 'todo';
        sortOrder: 'asc' | 'desc';
    };
}>;

type GetProjectRequest = FastifyRequest<{
    Params: { id: string };
}>;

export async function getProjects(
    request: GetProjectsRequest,
    reply: FastifyReply
) {
    const sortRule = request.query['sortRule'];
    const sortOrder = request.query['sortOrder'];

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (!userInfo?.user.user_id) {
            return reply
                .code(401)
                .send({ message: 'No user id present in token.' });
        }

        return reply.send(
            await prisma.project.findMany({
                where: {
                    user_id: userInfo?.user.user_id,
                },
                include: {
                    _count: {
                        select: { todo: true },
                    },
                },
                orderBy: {
                    [sortRule]:
                        sortRule === 'todo' ? { _count: sortOrder } : sortOrder,
                },
            })
        );
    }
    return reply.code(401).send({ message: 'No access token provided.' });
}

export async function getProject(
    request: GetProjectRequest,
    reply: FastifyReply
) {
    const { id: projectId } = request.params;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (!userInfo?.user.user_id) {
            return reply
                .code(401)
                .send({ message: 'No user id present in token.' });
        }

        return reply.send(
            await prisma.project.findFirst({
                where: {
                    user_id: userInfo?.user.user_id,
                    project_id: Number(projectId),
                },
                include: {
                    _count: {
                        select: { todo: true },
                    },
                },
            })
        );
    }
    return reply.code(401).send({ message: 'No access token provided.' });
}

export async function createProject(
    request: FastifyRequest<{
        Body: AddProject;
    }>,
    reply: FastifyReply
) {
    const data = request.body;

    console.log('Request:', request);
    console.log('Reply:', reply);

    if (data.start_date) {
        data.start_date = new Date(data.start_date).toISOString();
    }

    if (data.due_date) {
        data.due_date = new Date(data.due_date).toISOString();
    }

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (userInfo?.user.user_id) {
            const dataToSave: Prisma.projectUncheckedCreateWithoutTodoInput = {
                ...data,
                user_id: userInfo.user.user_id,
            };
            return reply.send(
                await prisma.project.create({
                    data: dataToSave,
                })
            );
        }
    }
}

export async function updateProject(
    request: FastifyRequest<{
        Body: UpdateProject;
        Params: { id: string };
    }>,
    reply: FastifyReply
) {
    const data = request.body;
    const { id: projectId } = request.params;

    console.log('Request:', request);
    console.log('Reply:', reply);

    if (data.start_date) {
        data.start_date = new Date(data.start_date).toISOString();
    }

    if (data.due_date) {
        data.due_date = new Date(data.due_date).toISOString();
    }

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (userInfo?.user.user_id) {
            const dataToSave: Prisma.projectUpdateInput = {
                ...data,
            };
            return reply.send(
                await prisma.project.update({
                    data: dataToSave,
                    where: {
                        project_id: Number(projectId),
                    },
                })
            );
        }
    }
}
