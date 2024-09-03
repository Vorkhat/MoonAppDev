"use client";
import {usePathname} from 'next/navigation'
import Link from "next/link";

import "./theme.css"
import styles from "./styles.module.scss";
import React from "react";
import {formatMenuIconPath, MenuIcon, MenuIconType} from "@/components/foooter/menu/menuIcons.ts";

interface ItemProps {
    icon: MenuIcon;
    href: string;
}

function MenuItem({icon, href, children}: ItemProps & Readonly<{children: React.ReactNode}>) {
    const pathname = usePathname()

    const active = pathname === href;

    return (
        <div className={styles.menu__item} style={active ? {borderBottom: '4px solid #2FACFF'} : {}}>
            <Link className={`${styles.menu__container} ${active ? styles.active : null}`} href={href} prefetch={false}>
                <i className={`${styles.item__icon}`}
                   style={{
                       backgroundColor: active ? '#2FACFF' : 'var(--color-text-menu)',
                       mask: `url(${formatMenuIconPath(icon, active ? MenuIconType.ACTIVE : MenuIconType.DEFAULT)}) no-repeat center`
                   }}
                />
                {children}
            </Link>
        </div>
    )
}

export default function MenuComponent() {

    return (
        <div className={styles.menu__items}>
            <MenuItem href={'/quiz'} icon={MenuIcon.QUIZ}><text className={styles.item__text}>Quiz</text></MenuItem>
            <MenuItem href={'/tasks'} icon={MenuIcon.TASKS}><text className={styles.item__text}>Tasks</text></MenuItem>
            <MenuItem href={'/home'} icon={MenuIcon.HOME}><text className={styles.item__text}>Home</text></MenuItem>
            <MenuItem href={'/rating'} icon={MenuIcon.RATING}><text className={styles.item__text}>Rating</text></MenuItem>
            <MenuItem href={'/profile'} icon={MenuIcon.PROFILE}><text className={styles.item__text}>Profile</text></MenuItem>
        </div>
);
}