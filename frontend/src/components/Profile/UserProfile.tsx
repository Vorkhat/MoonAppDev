'use client';

import './common.css';
import '../../app/globals.css'
import React, {useEffect, useState} from "react";
import {initInitData} from "@telegram-apps/sdk-react";
import styles from './styles.module.scss';
import ProfileAward from "@/components/Profile/award/ProfileAward";
import ProfileFriends from "@/components/Profile/friends/ProfileFriends";
import {Inter, Montserrat} from "next/font/google";

const montserrat = Montserrat({subsets: ['latin'],})
const inter = Inter({subsets: ['latin']})

const UserProfile = () => {

    const [username, setUsername] = useState('');
    const [id, setId] = useState(null);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {

        let data = initInitData();

        if (data) {
            const response = JSON.stringify(data);
            const jsonData = JSON.parse(response);

            const {firstName, lastName, username, id} = jsonData.initData.user;

            setFirstName(firstName);
            setLastName(lastName);
            setUsername(username);
            setId(id);

            const getUserPhoto = async (userId: number) => {
                const data = await fetch(`/api/userPhoto?userId=${userId}`);
                const blob = await data.blob();
                setPhoto(URL.createObjectURL(blob));
            }

            getUserPhoto(id).then()

        } else {
            setFirstName('undefined');
            setLastName('undefined');
            setUsername('undefined');
        }

    }, []);

    return (
        <div className={styles.user__profile}>
            <div className={styles.user__item}>
                {photo ? (
                    <img
                        className={styles.user__photo}
                        src={photo}
                        alt="User Photo"
                        width={160}
                        height={160}
                        style={{
                            width: '25vw',
                            height: '13vh',
                            borderRadius: '10%',
                        }}
                    />
                ) : (
                    <p>Loading...</p>
                )}
                <div className={styles.user__data}>
                    <div className={`${styles.user__name} ${inter.className}`}>{firstName} {lastName}</div>
                    <div className={`${styles.user__tag} ${inter.className}`}>@{username}</div>
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