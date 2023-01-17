import { FastifyInstance } from 'fastify';
import { register } from '../../controllers/user_controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', register);
}
