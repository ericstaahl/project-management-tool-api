import { FastifyInstance } from 'fastify';
import { register, login, newToken } from '../../controllers/user_controller';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', register);
    fastify.post('/login', login);
    fastify.post('/new-token', newToken);
}
