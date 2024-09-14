import { prisma } from '@/index';

export default async function () {
    await prisma.$transaction(async tx => {
        const snapshot = await tx.topSnapshot.findFirst({
            where: {
                takenAt: {
                    lte: new Date(),
                },
                completed: false,
            },
            select: {
                id: true,
            },
        });

        if (!snapshot) return;

        const top = await tx.usersTop.findMany({
            take: 200,
            select: {
                id: true,
                points: true,
            },
        });

        await tx.topSnapshot.update({
            where: {
                id: snapshot.id,
            },
            data: {
                completed: true,
                users: {
                    createMany: {
                        data: top.map(({ id, points }) => ({ userId: id, points })),
                    },
                },
            },
        });
    });
}