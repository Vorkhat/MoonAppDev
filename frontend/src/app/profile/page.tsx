import UserProfile from '@/components/pages/Profile/data/UserProfile';
import styles from './styles.module.scss';

export default async function Profile() {

    return (
        <div className={styles.profile__page}>
            <h2 className={'center'}>Профиль</h2>
            <UserProfile></UserProfile>
        </div>
    );
}
