"use client";
import { usePathname } from 'next/navigation'
import Link from "next/link";

import "./theme.css"
import styles from "./styles.module.scss";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    pathname: string;
    icon: string;
    iconCondition: string;
    text: string;
    href: string;
}

function CreateItem({pathname, icon, iconCondition,text, href}: ItemProps) {
    return (
        <div className={styles.menu__item}>
            <Link className={`${styles.menu__container} ${pathname === href ? styles.active : null}`} href={href} prefetch={false}>
                <div className={`${styles.item__icon} ${icon} ${pathname === href ? iconCondition : null}`}></div>
                <div className={`${styles.item__text} ${inter.className}`}>{text}</div>
            </Link>
            <div className={`${pathname === href ? styles.menu__condition : null}`}></div>
        </div>
    )
}


export default function MenuComponent() {

    const pathname = usePathname()

    return (
        <div className={styles.menu__items}>
            <CreateItem pathname={pathname} icon={styles.quiz__icon} iconCondition={styles.active__quiz} text={'Quiz'} href={'/quiz'}/>
            <CreateItem pathname={pathname} icon={styles.tasks__icon} iconCondition={styles.active__tasks} text={'Tasks'} href={'/tasks'}/>
            <CreateItem pathname={pathname} icon={styles.home__icon} iconCondition={styles.active__home} text={'Home'} href={'/home'}/>
            <CreateItem pathname={pathname} icon={styles.rating__icon} iconCondition={styles.active__rating} text={'Rating'} href={'/rating'}/>
            <CreateItem pathname={pathname} icon={styles.profile__icon} iconCondition={styles.active__profile} text={'Profile'} href={'/profile'}/>
        </div>
    );
}