'use server';

import React from 'react';
import styles from './styles.module.scss';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { RewardItem } from '@/components/pages/Profile/reward/RewardItem.tsx';
import { mapToIcon } from '@/components/pages/Profile/reward/iconMapper.tsx';

export async function getItems() {
    const session = await useSession();

    return prisma.completedTaskTypes.findMany({
                                                  where: {
                                                      id: session.userId,
                                                  },
                                              });
}

export default async function ProfileReward() {
    const completedTaskTypes = await getItems();

    return (
        <div className={styles.rewardItems}>
            {
                completedTaskTypes.map(value => (
                    <RewardItem image={mapToIcon(value.type)}
                               key={value.type}
                               type={value.type}
                               count={value.count}
                               number={value.reward ?? 0}
                               currency={'points'}/>
                ))
            }
        </div>
    );
}
