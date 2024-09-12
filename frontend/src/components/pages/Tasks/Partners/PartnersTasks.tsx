'use client';

import './theme.css';
import React from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { TasksIcon } from '../tasksIcon.ts';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const inter = Inter({ subsets: [ 'latin' ] });

type PartnerProps = {
    logo: string;
    name: string;
    award: number;
    link: string;
};

const data: PartnerProps[] = [
    { logo: TasksIcon.PARTNERS, name: 'Binance_world', award: 155, link: 'https://google.com' },
    { logo: TasksIcon.PARTNERS, name: 'Binance_world', award: 155, link: 'https://google.com' },
    { logo: TasksIcon.PARTNERS, name: 'Binance_world', award: 155, link: 'https://google.com' },
];

const PartnerItem: React.FC<PartnerProps> = ({ logo, name, award, link }) => {
    const t = useTranslations('Tasks');

    return (
        <div className={styles.background__partners_item}>
            <div className={`${styles.partners__item} ${inter.className}`}>
                <Image className={styles.partners__image} src={logo} alt="/" width={43} height={44}/>
                <div className={styles.partners__text}>{name}</div>
                <div className={styles.partners__award}>+{award} points</div>
                <Link className={styles.partners__link_background_one} href={link}>
                    <div className={styles.partners__link_background_two}>
                        <span className={styles.partners__link}>{t('content.partners.link')}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const PartnersTasks: React.FC = () => (
    <div className={styles.partners__list}>
        {data.map((item, index) => (
            <PartnerItem key={index} {...item} />
        ))}
    </div>
);

export default PartnersTasks;