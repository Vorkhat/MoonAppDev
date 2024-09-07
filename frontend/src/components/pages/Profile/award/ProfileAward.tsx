'use server';

import './theme.css'
import React from 'react';
import styles from './styles.module.scss';
import { prisma } from '@/prisma.ts';
import '@/components/pages/Profile/data/theme.css';
import { useSession } from '@/components/session';
import { AwardItem } from '@/components/pages/Profile/award/AwardItem.tsx';
import { mapToIcon } from '@/components/pages/Profile/award/iconMapper.tsx';

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
        <div className={styles.awardItems}>
            {
                completedTaskTypes.map(value => (
                    <AwardItem image={mapToIcon(value.type)} key={value.type} type={value.type} count={value.count}
                               number={value.reward ?? 0} currency={'points'}/>
                ))
            }
        </div>
    );
}
