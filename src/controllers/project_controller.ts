import {
    AddProjectSchema,
    UpdateProjectSchema,
    AddProject,
    UpdateProject,
    InviteUserSchema,
    InviteUser,
} from '../schemas/project_schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';
import getUserFromJwt from '../utilities/getUserFromJwt';

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
                    OR: [
                        {
                            members: {
                                some: {
                                    user_id: { equals: userInfo.user.user_id },
                                },
                            },
                        },
                        {
                            user_id: userInfo?.user.user_id,
                        },
                    ],
                },
                include: {
                    _count: {
                        select: { todo: true, members: true },
                    },
                    members: true,
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
    request: ProjectByIdRequest,
    reply: FastifyReply
) {
    const projectId = Number(request.params.id);

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
                    OR: [
                        {
                            members: {
                                some: {
                                    user_id: { equals: userInfo.user.user_id },
                                    project_id: { equals: projectId },
                                },
                            },
                        },
                        {
                            user_id: userInfo?.user.user_id,
                            project_id: projectId,
                        },
                    ],
                },
                include: {
                    _count: {
                        select: { todo: true, members: true },
                    },
                    members: true,
                },
            })
        );
    }
    return reply.code(401).send({ message: 'No access token provided.' });
}

export async function createProject(
    request: AddProjectRequest,
    reply: FastifyReply
) {
    const parsedData = AddProjectSchema.parse(request.body);

    console.log('Request:', request);
    console.log('Reply:', reply);

    // parsedData.start_date = new Date(parsedData.start_date).toISOString();

    // parsedData.due_date = new Date(parsedData.due_date).toISOString();

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (userInfo?.user.user_id) {
            const dataToSave: Prisma.projectUncheckedCreateWithoutTodoInput = {
                ...parsedData,
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
    request: UpdateProjectRequest,
    reply: FastifyReply
) {
    const parsedData = UpdateProjectSchema.parse(request.body);
    const { id: projectId } = request.params;

    console.log('Request:', request);
    console.log('Reply:', reply);

    // if (parsedData.start_date) {
    //     parsedData.start_date = new Date(parsedData.start_date).toISOString();
    // }

    // if (parsedData.due_date) {
    //     parsedData.due_date = new Date(parsedData.due_date).toISOString();
    // }

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (userInfo?.user.user_id) {
            const dataToSave: Prisma.projectUpdateInput = {
                ...parsedData,
            };
            return reply.send(
                await prisma.project.updateMany({
                    data: dataToSave,
                    where: {
                        project_id: Number(projectId),
                        user_id: userInfo.user.user_id,
                    },
                })
            );
        }
    }
}

export async function deleteProject(
    request: ProjectByIdRequest,
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

        if (userInfo?.user.user_id) {
            return reply.send(
                await prisma.project.deleteMany({
                    where: {
                        project_id: Number(projectId),
                        user_id: userInfo.user.user_id,
                    },
                })
            );
        }
    }
}

export async function inviteUser(
    request: InviteUserRequest,
    reply: FastifyReply
) {
    const parsedData = InviteUserSchema.parse(request.body);
    const { id: projectId } = request.params;

    console.log('Request:', request);
    console.log('Reply:', reply);

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        const userInfo = getUserFromJwt(
            request.headers.authorization.split(' ')[1]
        );

        if (parsedData.username === userInfo?.user.username) {
            return reply
                .code(400)
                .send({ message: 'Cannot add owner of project.' });
        }
        const userToAdd = await prisma.user.findUnique({
            where: { username: parsedData.username },
            select: { user_id: true },
        });

        console.log(userToAdd);

        if (userInfo?.user.user_id && userToAdd !== null) {
            return reply.send(
                await prisma.project.update({
                    where: {
                        project_id_user_id: {
                            project_id: Number(projectId),
                            user_id: userInfo.user.user_id,
                        },
                    },
                    data: {
                        members: {
                            create: {
                                user_id: userToAdd.user_id,
                                username: parsedData.username,
                            },
                        },
                    },
                })
            );
        }
    }
}

export type GetProjectsRequest = FastifyRequest<{
    Querystring: {
        sortRule: 'due_date' | 'title' | 'todo';
        sortOrder: 'asc' | 'desc';
    };
}>;

export type ProjectByIdRequest = FastifyRequest<{
    Params: { id: string };
}>;

export type AddProjectRequest = FastifyRequest<{
    Body: AddProject;
}>;

export type UpdateProjectRequest = FastifyRequest<{
    Body: UpdateProject;
    Params: { id: string };
}>;

export type InviteUserRequest = FastifyRequest<{
    Body: InviteUser;
    Params: { id: string };
}>;
