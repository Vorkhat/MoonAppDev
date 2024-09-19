import React from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { TasksIconMapper } from '../tasksIcon.ts';
import Link from 'next/link';
import { JsonObject } from '@prisma/client/runtime/library';
import ContainerColor from '@/common/ContainerColor';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma.ts';
import { getCurrentSessionLanguage } from '@/locale/locale.ts';

type PartnerProps = {
    url: string;
    data: JsonObject;
    reward: number
};


const PartnerItem = async ({ url, data, reward }: PartnerProps) => {
    const translator = await getTranslations('Tasks');

    const description = !data.description ? null : await prisma.localizationValue.findUnique({
        where: {
            id_language: {
                id: data.description as number,
                language: await getCurrentSessionLanguage(),
            },
        },
        select: {
            value: true,
        },
    });

    return (
        <ContainerColor classNameBorder={styles.partnerBorder}
                        classNameBackground={styles.partnerBackground}
        >
            <div className={styles.partnerItem}>
                <Image className={styles.partnerImage} src={TasksIconMapper.Partners} alt="/" width={43} height={44}/>
                <span className={styles.partnerDescription}>{description?.value || 'Undefined'}</span>
                <div className={styles.partnerReward}>
                    <ContainerColor
                        classNameBorder={[ styles.rewardValueBorder, 'fit-conteiner' ]}
                        classNameBackground={[ styles.rewardValueBackground, 'text-litle-container' ]}
                    >
                        {reward} points
                    </ContainerColor>
                </div>
                <Link href={url} className={styles.partnerLink}>
                    <ContainerColor classNameBorder={[ styles.partnerLinkBorder, 'fit-conteiner' ]}
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