'use server';

import '../common.css';
import React from 'react';
import styles from './styles.module.scss';
import { prisma } from '@/prisma.ts';
import { useSession } from '@/components/session';
import { AwardItem } from '@/components/Profile/award/AwardItem.tsx';
import { mapToIcon } from '@/components/Profile/award/iconMapper.tsx';

export async function getItems() {
    const session = await useSession();

    return prisma.completedTaskTypes.findMany({
                                                  where: {
                                                      id: session.userId,
                                                  },
                                              });
}

export default async function ProfileAward() {
    const completedTaskTypes = await getItems();

    return (
        <div className={styles.award__items}>
            {
                completedTaskTypes.map(value => (
                    <AwardItem image={mapToIcon(value.type)} key={value.type} type={value.type} count={value.count}
                               number={value.reward ?? 0} currency={'points'}/>
                ))
            }
        </div>
    );
}
