import { AddProject } from '../schemas/project_schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prisma';
import { server } from '../server';
import { Prisma } from '@prisma/client';

interface DecodedJwt {
  user: {
    user_id: number;
    username: string;
  };
  iat: number;
  exp: number;
}

export async function getProjects(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    const userInfo: DecodedJwt | null = server.jwt.decode(
      request.headers.authorization.split(' ')[1]
    );

    if (!userInfo?.user.user_id) {
      return reply.code(401).send({ message: 'No user id present in token.' });
    }

    return reply.send(
      await prisma.project.findMany({
        where: {
          user_id: userInfo?.user.user_id,
        },
      })
    );
  }
  return reply.code(401).send({ message: 'No access token provided.' });
}

export async function createProject(
  request: FastifyRequest<{
    Body: AddProject;
  }>,
  reply: FastifyReply
) {
  const data = request.body;

  console.log('Request:', request);
  console.log('Reply:', reply);

  if (data.start_date) {
    data.start_date = new Date(data.start_date).toISOString();
  }

  if (data.due_date) {
    data.due_date = new Date(data.due_date).toISOString();
  }

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    const userInfo: DecodedJwt | null = server.jwt.decode(
      request.headers.authorization.split(' ')[1]
    );

    if (userInfo?.user.user_id) {
      const dataToSave: Prisma.projectUncheckedCreateWithoutTodoInput = {
        ...data,
        user_id: userInfo.user.user_id,
      };
      return reply.send(
        await prisma.project.create({
          data: dataToSave,
        })
      );
    }
  }
}
