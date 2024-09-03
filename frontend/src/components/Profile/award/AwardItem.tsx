import styles from "@/components/Profile/award/styles.module.scss";
import Image from "next/image";
import React from "react";
import {Inter} from "next/font/google";
import {TaskType} from "@prisma/client";

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
        <div className={styles.award__background_gradient}>
            <div className={styles.award__item}>
                <Image src={image} alt={'/'} style={{width: '13vw', height: '5.7vh'}}/>
                <div className={`${styles.award__text} ${inter.className}`}>{type}</div>
                {type === TaskType.Invite ? <div className={`${styles.award__friends} ${inter.className}`}>{count}</div> : null}
                <div className={styles.award__count}>
                    <div className={styles.award__count_background}>
                        <div className={styles.award__value}>{number}</div>
                        <div className={styles.award__currency}>{currency}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}