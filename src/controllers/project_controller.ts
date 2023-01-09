import prisma from '../prisma';

export async function getProjects() {
  return await prisma.project.findMany();
}

export async function createProject() {
  await prisma.project.create({
    data: {
      title: 'Project1',
      number_of_members: 3,
      start_date: '2023/01/01',
      due_date: '2023/02/08',
    },
  });
}
