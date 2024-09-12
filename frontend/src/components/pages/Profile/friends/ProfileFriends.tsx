'use client';

import '@/components/pages/Profile/data/theme.css';
import React from "react";
import Image from "next/image";
import styles from './styles.module.scss';
import ImageInvitation from "../../../../../public/images/profile/invitations.svg"
import ImageCopyLink from "../../../../../public/images/profile/copyLink.svg"
import {Inter} from "next/font/google";
import { useTranslations } from 'next-intl';


const inter = Inter({subsets: ['latin']})

const ProfileFriends = () => {
    const t = useTranslations('Profile');

    return (
        <div className={styles.friends__container}>
            <div className={`${styles.container} ${styles.invitation}`}>
                <Image src={ImageInvitation} alt={'/'}/>
                <div className={`${styles.invitation__text} ${inter.className}`}>{t('footer')}</div>
            </div>
            <div className={`${styles.container} ${styles.copy_link}`}>
                <Image src={ImageCopyLink} alt={'/'}/>
            </div>
        </div>
    );
}

export default ProfileFriends;