'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';


type PartnerProps = {
    url: string;
    data: JsonObject;
    reward: number
};


const PartnerItem = ({ url, data, reward }: PartnerProps) => {
    const translator = useTranslations('Tasks');
    const description = typeof data.description === 'string' ? data.description : 'Undefined';

    return (
        <ContainerColor classNameBorder={styles.partnerBorder}
                        classNameBackground={styles.partnerBackground}
        >
            <div className={styles.partnerItem}>
                <Image className={styles.partnerImage} src={TasksIcon.PARTNERS} alt="/" width={43} height={44}/>
                <span className={styles.partnerDescription}>{description}</span>
                <div className={styles.partnerReward}>
                    <ContainerColor
                        classNameBorder={[styles.rewardValueBorder, 'fit-conteiner']}
                        classNameBackground={[styles.rewardValueBackground, 'text-litle-container']}
                    >
                        {reward} points
                    </ContainerColor>
                </div>
                <Link href={url} className={styles.partnerLink}>
                    <ContainerColor classNameBorder={[styles.partnerLinkBorder, 'fit-conteiner']}
                                    classNameBackground={styles.partnerLinkBackground}
                    >
                        <span className={styles.partnerLink}>{translator('content.partners.link')}</span>
                    </ContainerColor>
                </Link>
            </div>
        </ContainerColor>
    );
};

const PartnersTasks = ({ data }: { data: PartnerProps[] }) => (
    <div className={styles.partnersList}>
        {data.map((item, index) => (
            <PartnerItem key={index} {...item} />
        ))}
    </div>
);

export default PartnersTasks;