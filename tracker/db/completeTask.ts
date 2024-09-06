import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export default async function (
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>, taskId: bigint, userId: bigint | number) {
    return tx.taskCompletion.create({
                                        data: {
                                            taskId: taskId,
                                            userId: userId,
                                        },
                                    });
}