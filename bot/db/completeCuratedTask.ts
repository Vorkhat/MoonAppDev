import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export default async function (tx: Omit<PrismaClient, runtime.ITXClientDenyList>, curatedTaskId: bigint) {
    return tx.curatedTask.update({
                                     where: {
                                         id: curatedTaskId,
                                     },
                                     data: {
                                         completedAt: {
                                             set: 'now()',
                                         },
                                     },
                                     select: {
                                         taskId: true,
                                     },
                                 });
}