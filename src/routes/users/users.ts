import { FastifyInstance } from 'fastify';
import { register, login } from '../../controllers/user_controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', register);
  fastify.post('/login', login);
}
