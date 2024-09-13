import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './styles.module.scss';
import { useSession } from '@/components/session';
import '@/components/pages/Profile/data/theme.css';
import ImageInvitation from '../../../../../public/images/profile/invitations.svg';
import CopyButton from '@/components/pages/Profile/friends/copyButton';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/prisma';


const inter = Inter({ subsets: [ 'latin' ] });

const ProfileFriends = async () => {
    const { userId } = await useSession();
    const { id } = await prisma.invitation.findFirstOrThrow({
        where: {
            userId: userId,
        },
        select: {
            id: true,
        },
    });

    const t = await getTranslations('Profile');

    const refLink = `https://t.me/${process.env.APP_URL}?startapp=ref${id}`;

    return (
        <div className={styles.friends__container}>
            <Link className={`${styles.container} ${styles.invitation}`}
                  href={`https://t.me/share/url?url=${refLink}`}>
                <Image src={ImageInvitation} alt={'/'}/>
                <div className={`${styles.invitation__text} ${inter.className}`}> {t('footer')}</div>
            </Link>
            <CopyButton str={refLink}/>
        </div>
    );
};

export default ProfileFriends;