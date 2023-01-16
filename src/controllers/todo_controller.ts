import { Prisma } from '@prisma/client';
import prisma from '../prisma';

export async function getTodos(projectId: number) {
  return await prisma.todo.findMany({
    where: {
      project_id: projectId,
    },
  });
}

export async function addTodo(data: Prisma.todoCreateManyInput) {
  console.log(data);
  return await prisma.todo.create({
    data,
  });
}
