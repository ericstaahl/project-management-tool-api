import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const main = async () => {};

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//   });

export default prisma;