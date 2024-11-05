import './theme.scss';
import styles from './styles.module.scss';
import RatingItem from '@/components/pages/Rating/RatingItem.tsx';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';


export default async function Rating() {

    const translator = await getTranslations('Rating');


    const topSnapshotReward = await prisma.topSnapshot.findFirst({
                                                               orderBy: {
                                                                   id: 'desc',
                                                               },
                                                               select: {
                                                                   reward: true,
                                                               },
                                                           });
    return (
        <div className={styles.ratingPage}>
            <div className={styles.headerConrainer}>
                <p className={`${styles.headerText} ${styles.headerTitle}`} style={{
                    textAlign: 'center',
                }}>
                    <span style={{
                        fontSize: '1.8em',
                        fontWeight: 'bold',
                    }}>
                        {translator('header.title')}
                         <br/>
                    </span>
                    <span style={{ fontSize: '1.5em' }}>{translator('header.content')} </span>
                    <span style={{
                        color: 'var(--rating-text-color-header)',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                    }}>
                        {translator('header.footer')} {topSnapshotReward?.reward.toString() || '0'} USDT 🤑
                    </span>
                </p>
            </div>
            <RatingItem/>
        </div>
    );
};