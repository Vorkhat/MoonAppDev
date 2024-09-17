import React from 'react';
import Image from 'next/image';
import { TaskType } from '@prisma/client';
import styles from '@/components/pages/Profile/reward/styles.module.scss';
import { getTranslations } from 'next-intl/server';
import ContainerColor from '@/common/ContainerColor';


interface ItemProps {
    image: string,
    type: TaskType,
    number: number,
    count: number,
    currency: string
}

export async function RewardItem({ image, type, number, currency, count }: ItemProps) {
    const translator = await getTranslations('Profile');

    return (
        <div className={`${styles.rewardContainer} ${styles.rewardContainerBorder} gradient-border`}>
            <div className={styles.rewardContent}>
                <Image src={image} alt="" width={33} height={33}/>
                <h4 className={styles.rewardText}>
                    {translator(`content.${type}`)}
                </h4>
                {type === TaskType.Invite ? <h3 style={{margin: '0 2vw'}} className="friends-counter">
                    {count}
                </h3> : null}
            </div>
            <h6 className={`${styles.reward} ${styles.rewardBorder} gradient-border`}>{number} {currency}</h6>
        </div>
    );
}