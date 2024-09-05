import './common.css';
import React from "react";
import styles from './styles.module.scss';
import ProfileAward from "@/components/Profile/award/ProfileAward";
import ProfileFriends from "@/components/Profile/friends/ProfileFriends";
import {Inter, Montserrat} from "next/font/google";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions} from "@/components/session";
import {cookies} from "next/headers";
import {prisma} from "@/prisma.ts";

const montserrat = Montserrat({subsets: ['latin'],})
const inter = Inter({subsets: ['latin']})

export async function getUser(id: number){
    return prisma.usersTop.findUniqueOrThrow({
        where: {
            id: id
        }
    })
}

const UserProfile = async () => {
    const session: SessionData = await getIronSession<SessionData>(cookies(), sessionOptions);

    const user = await getUser(session.userId);

    return (
        <div className={styles.user__profile}>
            <div className={styles.user__item}>
                <img
                    className={styles.user__photo}
                    src={`/api/userPhoto/${session.userId}`}
                    alt=""
                    width={160}
                    height={160}
                />
                <div className={styles.user__data}>
                    <div className={`${styles.user__name} ${inter.className}`}>{session.firstName} {session.lastName}</div>
                    {session.username ? <div className={`${styles.user__tag} ${inter.className}`}>@{session.username}</div> : <></>}
                    <div className={`${styles.user__rating} ${inter.className}`}>#{user.rank} в рейтинге</div>
                </div>
            </div>
            <div className={styles.user__balance}>
                <div className={styles.gradient}>
                    <div className={`${styles.user__balance_value} ${montserrat.className}`}>{user.points}</div>
                    <div className={`${styles.user__balance_currency} ${montserrat.className}`}>points</div>
                </div>
            </div>
            <ProfileAward/>
            <ProfileFriends/>
        </div>
    );
}

export default UserProfile;