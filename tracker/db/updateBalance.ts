import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export default async function (
    tx: Omit<PrismaClient, runtime.ITXClientDenyList>, userId: bigint | number, amount: number) {
    return tx.user.update({
                              where: {
                                  id: userId,
                              },
                              data: {
                                  points: {
                                      increment: amount,
                                  },
                              },
                          });
}