'use client';

import React from "react";
import Image from "next/image";
import styles from './styles.module.scss';
import ImageComments from "../../../../public/images/profile/comments.svg"
import ImageActive from "../../../../public/images/profile/active.svg"
import ImageTasks from "../../../../public/images/profile/tasks.svg"
import ImageFriends from "../../../../public/images/profile/friends.svg"


interface ItemProps {
    image: string,
    text: string,
    number: number,
    currency: string
}


function AwardItem({image, text, number, currency}: ItemProps) {
    return (
        <div className={styles.award__item}>
            <Image src={image} alt={'/'}/>
            <div className={styles.award__text}>{text}</div>
            <div className={styles.award__currency}>{number} {currency}</div>
        </div>
    )
}

const ProfileAward = () => {

    return (
        <div className={styles.award__items}>
            <AwardItem image={ImageComments} text={'Коментарии'} number={155} currency={'points'}></AwardItem>
            <AwardItem image={ImageActive} text={'Активности'} number={155} currency={'points'}></AwardItem>
            <AwardItem image={ImageTasks} text={'Задания'} number={155} currency={'points'}></AwardItem>
            <AwardItem image={ImageFriends} text={'Друзья'} number={155} currency={'points'}></AwardItem>
        </div>
    );
}

export default ProfileAward;