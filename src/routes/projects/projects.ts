import { FastifyInstance, FastifyRequest } from 'fastify';
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
} from '../../controllers/project_controller';
import { AddProject } from '../../schemas/project_schema';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
    fastify.get(
        '/',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Params: { id: string };
                        Querystring: {
                            sortRule: 'due_date' | 'title' | 'todo';
                            sortOrder: 'asc' | 'desc';
                            statusFilter: string;
                        };
                    }>
                >,
            ],
        },
        getProjects
    );
    fastify.get(
        '/:id',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Params: { id: string };
                    }>
                >,
            ],
        },
        getProject
    );
    fastify.post(
        '/',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Body: AddProject;
                    }>
                >,
            ],
        },
        createProject
    );
    fastify.post(
        '/:id',
        {
            preHandler: [
                verifyAccessToken<
                    FastifyRequest<{
                        Body: AddProject;
                    }>
                >,
            ],
        },
        updateProject
    );
}
