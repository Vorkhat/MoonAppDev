import Image from 'next/image';
import styles from './styles.module.scss';
import { useSession } from '@/components/session';
import ImageInvitation from '@/app/(content)/profile/images/invitations.svg';
import CopyButton from '@/components/pages/Profile/friends/copyButton';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import OpenInTelegramButton from '@/components/pages/Profile/friends/openInTelegramButton.tsx';

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
            <OpenInTelegramButton className={`${styles.container} ${styles.invitation}`}
                                  href={`https://t.me/share/url?url=${refLink}`}>
                <Image src={ImageInvitation} alt={'/'}/>
                <h3 className={styles.invitationText}
                    style={{ fontWeight: '500' }}
                >
                    {translator('footer')}
                </h3>
            </OpenInTelegramButton>
            <CopyButton str={refLink}/>
        </div>
    );
};

export default ProfileFriends;