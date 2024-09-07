"use client";
import {usePathname} from 'next/navigation'
import Link from "next/link";

import "./theme.css"
import styles from "./styles.module.scss";
import React from "react";
import {formatMenuIconPath, MenuIcon, MenuIconType} from "@/components/foooter/menu/menuIcons.ts";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

interface ItemProps {
    icon: MenuIcon;
    href: string;
}

function MenuItem({icon, href, children}: ItemProps & Readonly<{children: React.ReactNode}>) {
    const pathname = usePathname()

    const active = pathname === href;

    return (
        <div className={styles.menuItem} style={active ? {
            borderBottom: '4px solid #2FACFF',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
        } : {}}>
            <Link className={`${styles.menuContainer} ${active ? styles.active : null}`} href={href} prefetch={false}>
                <i className={`${styles.itemIcon}`}
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
        <div className={`${styles.menuItems} ${inter.className}`}>
            <MenuItem href={'/quiz'} icon={MenuIcon.QUIZ}>
                <span className={styles.itemText}>Quiz</span>
            </MenuItem>
            <MenuItem href={'/tasks'} icon={MenuIcon.TASKS}>
                <span className={styles.itemText}>Tasks</span>
            </MenuItem>
            <MenuItem href={'/home'} icon={MenuIcon.HOME}>
                <span className={styles.itemText}>Home</span>
            </MenuItem>
            <MenuItem href={'/rating'} icon={MenuIcon.RATING}>
                <span className={styles.itemText}>Rating</span>
            </MenuItem>
            <MenuItem href={'/profile'} icon={MenuIcon.PROFILE}>
                <span className={styles.itemText}>Profile</span>
            </MenuItem>
        </div>
);
}