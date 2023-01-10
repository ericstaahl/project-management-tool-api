import prisma from '../prisma';

interface Project {
  title?: string;
  project_id?: number;
  number_of_members?: number;
  start_date?: string;
  due_date?: string;
}

export async function getProjects() {
  return await prisma.project.findMany();
}

export async function createProject(data: Project) {
  console.log(data);
  if (data.start_date) {
    data.start_date = new Date(data.start_date).toISOString();
  }
  if (data.due_date) {
    data.due_date = new Date(data.due_date).toISOString();
  }

  return await prisma.project.create({
    data,
  });
}
