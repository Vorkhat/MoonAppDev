import './theme.scss'
import UserProfile from '@/components/pages/Profile/data/UserProfile';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';

export default async function Profile() {
    const t = await getTranslations('Profile');

    return (
        <div className={styles.profile__page}>
            <h2 className={'center'} style={{ marginTop: '1.5vh', fontWeight: 'normal' }}>{t('title')}</h2>
            <UserProfile></UserProfile>
        </div>
    );
}