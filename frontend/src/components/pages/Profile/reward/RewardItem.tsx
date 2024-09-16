import React from "react";
import Image from "next/image";
import {TaskType} from "@prisma/client";
import styles from "@/components/pages/Profile/reward/styles.module.scss";
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
        <ContainerColor classNameBorder={styles.rewardBorder} classNameBackground={styles.rewardBackground}>
            <div className={styles.rewardContainer}>
                <div className={styles.rewardContent}>
                    <Image src={image} alt='' width={33} height={33}/>
                    <div className={styles.rewardText}>
                        {translator(`content.${type}`)}
                    </div>
                    {type === TaskType.Invite ? <div className="friends-counter">
                        {count}
                    </div> : null}
                </div>
                <ContainerColor
                    classNameBorder={[styles.rewardValueBorder, 'fit-conteiner']}
                    classNameBackground={[styles.rewardValueBackground, 'text-litle-container']}
                >
                    {number} {currency}
                </ContainerColor>
            </div>
        </ContainerColor>
    )
}