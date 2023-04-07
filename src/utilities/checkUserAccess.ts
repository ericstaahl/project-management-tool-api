import prisma from '../prisma';

export default async function checkUserAccess(
    user_id: number,
    projectId: number
) {
    // check if user has access to project
    await prisma.project.findFirstOrThrow({
        where: {
            OR: [
                {
                    members: {
                        some: {
                            user_id: {
                                equals: user_id,
                            },
                            project_id: { equals: projectId },
                        },
                    },
                },
                {
                    user_id: user_id,
                    project_id: projectId,
                },
            ],
        },
    });
}
