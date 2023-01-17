import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { z, ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

const User = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

// data: z.infer<typeof User>
export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log(request.body);

    const parsedData = User.parse(request.body);
    console.log('parsedData:', parsedData);

    const userToSave = { ...parsedData };

    try {
      userToSave.password = await bcrypt.hash(userToSave.password, 10);
    } catch (error) {
      console.log(error);
      return reply.code(500).send({
        message: 'An error occured when attempting to hash provided password',
      });
    }
    console.log('userToSave:', userToSave);
    await prisma.user.create({
      data: userToSave,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ errors: error.flatten() });
    } else {
      return reply.code(500).send();
    }
  }
}
