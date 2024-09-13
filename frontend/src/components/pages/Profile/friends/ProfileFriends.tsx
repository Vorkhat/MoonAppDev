import Image from "next/image";
import {Inter} from "next/font/google";
import styles from './styles.module.scss';
import {useSession } from '@/components/session';
import '@/components/pages/Profile/data/theme.css';
import ImageInvitation from "../../../../../public/images/profile/invitations.svg"
import CopyButton from '@/components/pages/Profile/friends/copyButton';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';


const inter = Inter({subsets: ['latin']})

const ProfileFriends = async () => {
    const session = await useSession();
    const t = await getTranslations('Profile');

    return (
        <div className={styles.friends__container}>
            <Link className={`${styles.container} ${styles.invitation}`} href={`https://t.me/share/url?url=MoonAppTestBot/mapp/app?startapp=invitedBy${session.userId}`}>
                <Image src={ImageInvitation} alt={'/'}/>
                <div className={`${styles.invitation__text} ${inter.className}`}> {t('footer')}</div>
            </Link>
            <CopyButton userId={session.userId}/>
        </div>
    );
}

export default ProfileFriends;