import './theme.css';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import RatingItem from '@/components/pages/Rating/RatingItem.tsx';
import { getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: [ 'latin' ] });

export default async function Rating() {

    const t = await getTranslations('Rating');

    return (
        <div className={styles.ratingPage}>
            <div className={`${styles.headerConrainer} ${inter.className}`}>
                <p className={`${styles.headerText} ${styles.headerTitle}`} style={{
                    textAlign: 'center',
                }}>
                    <span style={{
                        fontSize: '2em',
                        fontWeight: 'bold',
                    }}>{t('header.title')}<br/></span>
                    <span style={{ fontSize: '1.5em' }}>{t('header.content')}</span>
                    <span style={{
                        color: 'var(--rating-text-color-header-theme)',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                    }}> {t('header.footer')} 1000$ 🤑</span>
                </p>
            </div>
            <RatingItem/>
        </div>
    );
};