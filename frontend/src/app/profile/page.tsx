import UserProfile from '@/components/Profile/UserProfile';
import styles from '@/app/profile/styles.module.scss';

export default async function Profile() {

    return (
        <div className={styles.profile__page}>
            <h2 className={'center'}>Профиль</h2>
            <UserProfile></UserProfile>
        </div>
    );
}
