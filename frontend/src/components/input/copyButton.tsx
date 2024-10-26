'use client';

import React, { useState } from 'react';
import styles from '@/components/pages/Profile/friends/styles.module.scss';
import Image from 'next/image';
import ImageCopyLink from '@/app/(content)/profile/images/copyLink.svg';

const CopyButton = ({ str }: { str: string }) => {
    const [ copied, setCopied ] = useState(false);
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(` Друг, подпишись на бота фитнес приложения MotionFan если хочешь получать USDT и подарки на шаги, участие в челленджах и выполнение заданий в боте \n\n${str}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <button className={`${styles.container} ${styles.copyLink} ${styles.containerBorder} gradient-border`} onClick={copyToClipboard}>
            <Image src={ImageCopyLink} alt={'/'}/>
        </button>
    );
};

export default CopyButton;