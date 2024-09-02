import UserProfile from "@/components/Profile/UserProfile";
import styles from "@/app/profile/styles.module.scss";

export default async function Profile() {

    return (
        <div className={styles.profile__page}>
            <div className={styles.header__text}>Профиль</div>
            <UserProfile></UserProfile>
        </div>
    );
}
