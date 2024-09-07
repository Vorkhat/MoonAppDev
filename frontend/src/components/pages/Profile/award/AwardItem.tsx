import React from "react";
import Image from "next/image";
import {Inter} from "next/font/google";
import {TaskType} from "@prisma/client";
import styles from "@/components/pages/Profile/award/styles.module.scss";
import AwardComponent from '@/components/pages/common/components/AwardComponent/AwardComponent';
import ContainerContent from '@/components/pages/common/components/ContainerContent/ContainerContent';

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    image: string,
    type: TaskType,
    number: number,
    count: number,
    currency: string
}

export function AwardItem({image, type, number, currency, count}: ItemProps) {
    return (
        <ContainerContent>
            <div className={styles.awardContainer}>
                <div className={`${styles.awardContent} ${inter.className}`}>
                    <Image src={image} alt={'/'} style={{width: '13vw', height: '5.7vh'}}/>
                    <div className={styles.awardText}>{type}</div>
                    {type === TaskType.Invite ? <div className={styles.awardFriends}>{count}</div> : null}
                </div>
                <AwardComponent>{number} {currency}</AwardComponent>
            </div>
        </ContainerContent>
    )
}