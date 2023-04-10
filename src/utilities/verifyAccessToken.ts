import { FastifyReply, FastifyRequest } from 'fastify';
import { server } from '../server';

const verifyAccessToken = async <T extends FastifyRequest>(
    req: T,
    reply: FastifyReply
) => {
    console.log('Here:', req, reply);
    await server.verifyJwt(req, reply);
};

export default verifyAccessToken;
