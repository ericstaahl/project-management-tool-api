import { FastifyReply, FastifyRequest } from 'fastify';
import { server } from '../server';

const verifyAccessToken = async <T extends FastifyRequest>(
  req: T,
  reply: FastifyReply
) => {
  await server.verifyJwt(req, reply);
};

export default verifyAccessToken;
