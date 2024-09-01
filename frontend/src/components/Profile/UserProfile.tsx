'use client';

import './common.css';
import '../../app/globals.css'
import React, {useEffect, useState} from "react";
import {initInitData, User} from "@telegram-apps/sdk-react";
import styles from './styles.module.scss';
import ProfileAward from "@/components/Profile/award/ProfileAward";
import ProfileFriends from "@/components/Profile/friends/ProfileFriends";
import {Inter, Montserrat} from "next/font/google";

const montserrat = Montserrat({subsets: ['latin'],})
const inter = Inter({subsets: ['latin']})

const UserProfile = () => {

    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        setUser(initInitData()?.user)
    }, []);

    return (
        <div className={styles.user__profile}>
            <div className={styles.user__item}>
                {user ? (
                    <img
                        className={styles.user__photo}
                        src={`/api/userPhoto/${user.id}`}
                        alt="User Photo"
                        width={160}
                        height={160}
                    />
                ) : (
                    <p className={styles.user__photo}>Loading...</p>
                )}
                <div className={styles.user__data}>
                    <div className={`${styles.user__name} ${inter.className}`}>{user?.firstName} {user?.lastName}</div>
                    {user?.username ? <div className={`${styles.user__tag} ${inter.className}`}>@{user.username}</div> : <></>}
                    <div className={`${styles.user__rating} ${inter.className}`}>#112 в рейтинге</div>
                </div>
            </div>
            <div className={styles.user__balance}>
                <div className={styles.gradient}>
                    <div className={`${styles.user__balance_value} ${montserrat.className}`}>11,249.040</div>
                    <div className={`${styles.user__balance_currency} ${montserrat.className}`}>points</div>
                </div>
            </div>
            <ProfileAward/>
            <ProfileFriends/>
        </div>
    );
}

export default UserProfile;