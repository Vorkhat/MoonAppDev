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
            <header className={`${styles.headerConrainer} ${inter.className}`}>
                <p className={`${styles.headerText} ${styles.headerTitle}`} style={{
                    textAlign: 'center',
                }}>
                    <span style={{
                        fontSize: '3.3vh',
                        fontWeight: 'bold',
                    }}>{t('header.title')}<br/></span>
                    {t('header.content')}
                    <span style={{ color: 'var(--rating-text-color-header-theme)' }}> {t('header.footer')} 1000$ 🤑</span>
                </p>
            </header>
            <RatingItem/>
        </div>
    );
};