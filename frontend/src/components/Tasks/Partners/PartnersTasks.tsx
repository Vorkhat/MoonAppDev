'use client'

import './theme.css'
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import React from "react";
import partnersImage from '../../../../public/images/tasks/partners.svg'
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

type partnersProps = {
    logo: string,
    name: string,
    award: number,
    link: string
};

const data: partnersProps[] = [
    {logo: partnersImage, name: 'Binance_world', award: 155, link: 'https://google.com'},
    {logo: partnersImage, name: 'Binance_world', award: 155, link: 'https://google.com'},
    {logo: partnersImage, name: 'Binance_world', award: 155, link: 'https://google.com'},
    {logo: partnersImage, name: 'Binance_world', award: 155, link: 'https://google.com'},
];


const PartnersTasks = () => {
    return (
        <div className={styles.partners__list}>
            {data.map((item) => (
                <div className={styles.background__partners_item}>
                    <div className={styles.partners__item}>
                        <Image className={styles.partners__image} src={item.logo} alt={'/'}/>
                        <div className={`${styles.partners__text} ${inter.className}`}>{item.name}</div>
                        <div className={`${styles.partners__award} ${inter.className}`}>+{item.award} points</div>
                        <div className={styles.partners__link_backround}>
                            <Link className={`${styles.partners__link} ${inter.className}`} href={item.link}>Запустить</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PartnersTasks;