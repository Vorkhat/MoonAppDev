'use server';

import '../common.css';
import React from "react";
import styles from './styles.module.scss';
import ImageComments from "../../../../public/images/profile/comments.svg";
import ImageInvite from "../../../../public/images/profile/friends.svg";
import ImageGame from "../../../../public/images/profile/active.svg";
import ImageTask from "../../../../public/images/profile/tasks.svg";
import {prisma} from "@/prisma.ts";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions} from "@/components/session";
import {cookies} from "next/headers";
import {AwardItem} from "@/components/Profile/award/AwardItem.tsx";
import {TaskType} from "@prisma/client";

function mapToIcon(type: TaskType) {
    switch (type) {
        case TaskType.Comment:
            return ImageComments;
        case TaskType.Invite:
            return ImageInvite;
        case TaskType.Game:
            return ImageGame;
        case TaskType.Task:
            return ImageTask;
    }
}

export async function getItems() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    return prisma.completedTaskTypes.findMany({
        where: {
            id: session.userId,
        }
    });
}

export default async function ProfileAward() {
    const completedTaskTypes = await getItems();

    return (
        <div className={styles.award__items}>
            {
                completedTaskTypes.map(value => (
                    <AwardItem image={mapToIcon(value.type)} key={value.type} type={value.type} count={value.count} number={value.reward ?? 0} currency={'points'}/>
                ))
            }
        </div>
    );
}
