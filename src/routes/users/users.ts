import { FastifyInstance, FastifyRequest } from 'fastify';
import {
    register,
    login,
    newToken,
    getUsers,
    getMembers,
    GetMembersRequest,
} from '../../controllers/user_controller';
import verifyAccessToken from '../../utilities/verifyAccessToken';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', register);
    fastify.post('/login', login);
    fastify.post('/new-token', newToken);
    fastify.get(
        '/',
        {
            preHandler: [verifyAccessToken<FastifyRequest>],
        },
        getUsers
    );
    fastify.get(
        '/:id',
        {
            preHandler: [verifyAccessToken<GetMembersRequest>],
        },
        getMembers
    );
}
