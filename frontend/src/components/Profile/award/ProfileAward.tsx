'use client';

import '../common.css';
import React from "react";
import Image from "next/image";
import styles from './styles.module.scss';
import ImageComments from "../../../../public/images/profile/comments.svg"
import ImageActive from "../../../../public/images/profile/active.svg"
import ImageTasks from "../../../../public/images/profile/tasks.svg"
import ImageFriends from "../../../../public/images/profile/friends.svg"
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    image: string,
    text: string,
    number: number,
    currency: string
    friends: boolean
}


function AwardItem({image, text, number, currency, friends}: ItemProps) {
    return (
        <div className={styles.award__background_gradient}>
            <div className={styles.award__item}>
                <Image src={image} alt={'/'} style={{width: '13vw', height: '5.7vh'}}/>
                <div className={`${styles.award__text} ${inter.className}`}>{text}</div>
                {friends ? <div className={`${styles.award__friends} ${inter.className}`}>10</div> : null}
                <div className={styles.award__count}>
                    <div className={styles.award__count_background}>
                        <div className={styles.award__value}>{number}</div>
                        <div className={styles.award__currency}>{currency}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProfileAward = () => {

    return (
        <div className={styles.award__items}>
            <AwardItem image={ImageComments} text={'Коментарии'} number={155} currency={'points'} friends={false}></AwardItem>
            <AwardItem image={ImageActive} text={'Активности'} number={155} currency={'points'} friends={false}></AwardItem>
            <AwardItem image={ImageTasks} text={'Задания'} number={155} currency={'points'} friends={false}></AwardItem>
            <AwardItem image={ImageFriends} text={'Друзья'} number={155} currency={'points'} friends={true}></AwardItem>
        </div>
    );
}

export default ProfileAward;