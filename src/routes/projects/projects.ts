import { FastifyInstance, FastifyRequest } from 'fastify';
import {
    getProjects,
    createProject,
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
                            statusFilter: string;
                        };
                    }>
                >,
            ],
        },
        getProjects
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
}
