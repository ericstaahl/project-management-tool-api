import prisma from '../prisma';

export async function getTodos(projectId: number) {
  return await prisma.todo.findMany({
    where: {
      project_id: projectId,
    },
  });
}
