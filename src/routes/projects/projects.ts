import { FastifyInstance } from 'fastify';
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    inviteUser,
    GetProjectsRequest,
    ProjectByIdRequest,
    AddProjectRequest,
    InviteUserRequest,
    UpdateProjectRequest,
    addProjectComment,
    AddProjectCommentRequest,
} from '../../controllers/project_controller';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
    fastify.get(
        '/',
        {
            preHandler: [verifyAccessToken<GetProjectsRequest>],
        },
        getProjects
    );
    fastify.get(
        '/:id',
        {
            preHandler: [verifyAccessToken<ProjectByIdRequest>],
        },
        getProject
    );
    fastify.post(
        '/',
        {
            preHandler: [verifyAccessToken<AddProjectRequest>],
        },
        createProject
    );
    fastify.post(
        '/:id',
        {
            preHandler: [verifyAccessToken<UpdateProjectRequest>],
        },
        updateProject
    );
    fastify.delete(
        '/:id',
        {
            preHandler: [verifyAccessToken<ProjectByIdRequest>],
        },
        deleteProject
    );
    fastify.post(
        '/:id/invite',
        {
            preHandler: [verifyAccessToken<InviteUserRequest>],
        },
        inviteUser
    );
    fastify.post(
        '/:id/comment',
        {
            preHandler: [verifyAccessToken<AddProjectCommentRequest>],
        },
        addProjectComment
    );
}
