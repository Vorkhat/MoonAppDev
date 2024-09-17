import './common.scss'
import UserProfile from '@/components/pages/Profile/data/UserProfile';
import styles from './styles.module.scss';
import { getTranslations } from 'next-intl/server';

export default async function Profile() {
    const translator = await getTranslations('Profile');

    return (
        <div className={styles.profilePageContainer}>
            <h2 className='center' style={{ margin: '1.5vh 0', fontWeight: 'normal' }}>{translator('title')}</h2>
            <UserProfile></UserProfile>
        </div>
    );
}
