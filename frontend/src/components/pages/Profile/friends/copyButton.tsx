'use client';

import React, { useState } from 'react';
import styles from '@/components/pages/Profile/friends/styles.module.scss';
import Image from 'next/image';
import ImageCopyLink from '../../../../../public/images/profile/copyLink.svg';

const CopyButton = ({ str }: { str: string }) => {
    const [ copied, setCopied ] = useState(false);
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(str);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <button className={`${styles.container} ${styles.copy_link}`} onClick={copyToClipboard}>
            <Image src={ImageCopyLink} alt={'/'}/>
        </button>
    );
};

export default CopyButton;