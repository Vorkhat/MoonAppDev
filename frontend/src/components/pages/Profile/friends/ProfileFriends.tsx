import Image from 'next/image';
import styles from './styles.module.scss';
import { useSession } from '@/components/session';
import ImageInvitation from '../../../../../public/images/profile/invitations.svg';
import CopyButton from '@/components/pages/Profile/friends/copyButton';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/prisma';

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

    const translator = await getTranslations('Profile');

    const refLink = `https://t.me/${process.env.APP_URL}?startapp=ref${id}`;

    return (
        <div className={styles.friendsContainer}>
            <Link className={`${styles.container} ${styles.invitation}`} href={`https://t.me/share/url?url=${refLink}`}>
                <Image src={ImageInvitation} alt={'/'}/>
                <div className={styles.invitationText}> {translator('footer')}</div>
            </Link>
            <CopyButton str={refLink}/>
        </div>
    );
};

export default ProfileFriends;