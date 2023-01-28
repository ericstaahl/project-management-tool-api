import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { z, ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { server } from '../server';

const User = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginRequest = FastifyRequest<{
  Body: z.infer<typeof LoginSchema>;
}>;

// data: z.infer<typeof User>
export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parsedData = User.parse(request.body);

    const userToSave = { ...parsedData };

    try {
      userToSave.password = await bcrypt.hash(userToSave.password, 10);
    } catch (error) {
      return reply.code(500).send({
        message: 'An error occured when attempting to hash provided password',
      });
    }
    await prisma.user.create({
      data: userToSave,
    });
    return reply.code(201).send({ message: 'User successfully registered.' });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ errors: error.flatten() });
    } else {
      return reply.code(500).send();
    }
  }
}

export async function login(request: LoginRequest, reply: FastifyReply) {
  const parsedData = User.parse(request.body);
  // find user
  console.log(parsedData);
  const user = await prisma.user.findUnique({
    where: {
      username: parsedData.username,
    },
  });
  if (user === null) {
    return reply.code(401).send({
      message: 'Incorrect username or password provided.',
    });
  }
  // get password
  const hashedPassword = user.password;

  // check provided password againt db password
  const res = await bcrypt.compare(parsedData.password, hashedPassword);
  if (res) {
    const { password, ...rest } = user;
    return reply.code(200).send({
      ...rest,
      token: server.jwt.sign({ user: rest }, { expiresIn: '4h' }),
    });
  }
  return reply.code(401).send({
    message: 'Incorrect username or password provided.',
  });
}
