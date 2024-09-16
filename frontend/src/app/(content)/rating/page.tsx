import './theme.scss';
import styles from './styles.module.scss';
import RatingItem from '@/components/pages/Rating/RatingItem.tsx';
import { getTranslations } from 'next-intl/server';


export default async function Rating() {

    const translator = await getTranslations('Rating');

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
                        {translator('header.footer')} 1000$ 🤑
                    </span>
                </p>
            </div>
            <RatingItem/>
        </div>
    );
};