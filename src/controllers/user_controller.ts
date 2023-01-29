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

type NewTokenRequest = FastifyRequest<{
  Body: {
    token: string;
  };
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
      access_token: server.jwt.sign(
        { user: rest, type: 'access_token' },
        { expiresIn: '4h' }
      ),
      refresh_token: server.jwt.sign(
        { user: rest, type: 'refresh_token' },
        { expiresIn: '12h' }
      ),
    });
  }
  return reply.code(401).send({
    message: 'Incorrect username or password provided.',
  });
}

export async function newToken(request: NewTokenRequest, reply: FastifyReply) {
  const token = request.body.token;
  if (token === undefined) {
    reply.code(400).send({
      message: 'No refresh token provided',
    });
    return;
  }
  server.jwt.verify(token, (err, decoded) => {
    if (err) throw err;
    if (decoded.type === 'refresh_token') {
      console.log(decoded);
      const newAccessToken = server.jwt.sign(
        { user: decoded.user, type: 'access_token' },
        { expiresIn: '4h' }
      );
      reply.code(200).send({
        user: decoded.user,
        access_token: newAccessToken,
      });
    } else {
      reply.code(401).send({
        message: 'The provided token was not a refresh token.',
      });
    }
  });
}
