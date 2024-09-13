'use client';

import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { JsonObject } from '@prisma/client/runtime/library';

const inter = Inter({ subsets: [ 'latin' ] });

type PartnerProps = {
    url: string;
    data: JsonObject;
    reward: number
};


const PartnerItem = ({ url, data, reward }: PartnerProps) => {
    const t = useTranslations('Tasks');
    const description = typeof data.description === 'string' ? data.description : 'Undefined';

    return (
        <div className={styles.background__partners_item}>
            <div className={`${styles.partners__item} ${inter.className}`}>
                <Image className={styles.partners__image} src={TasksIcon.PARTNERS} alt="/" width={43} height={44}/>
                <div className={styles.partners__text}>{description}</div>
                <div className={styles.partners__award}>+{reward} points</div>
                <Link className={styles.partners__link_background_one} href={url}>
                    <div className={styles.partners__link_background_two}>
                        <span className={styles.partners__link}>{t('content.partners.link')}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const PartnersTasks = ({ data }: { data: PartnerProps[] }) => (
    <div className={styles.partners__list}>
        {data.map((item, index) => (
            <PartnerItem key={index} {...item} />
        ))}
    </div>
);

export default PartnersTasks;