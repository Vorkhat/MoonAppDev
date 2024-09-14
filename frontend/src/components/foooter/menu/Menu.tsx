'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { formatMenuIconPath, MenuIcon, MenuIconType } from '@/components/foooter/menu/menuIcons.ts';
import styles from './styles.module.scss';
import { Inter } from 'next/font/google';
import { useTransitionRouter } from 'next-view-transitions';

const inter = Inter({ subsets: [ 'latin' ] });

const menuItems = [
    { href: '/quiz', label: 'Quiz', icon: MenuIcon.QUIZ },
    { href: '/tasks', label: 'Tasks', icon: MenuIcon.TASKS },
    { href: '/home', label: 'Home', icon: MenuIcon.HOME },
    { href: '/rating', label: 'Rating', icon: MenuIcon.RATING },
    { href: '/profile', label: 'Profile', icon: MenuIcon.PROFILE },
];

const MenuItem = ({ icon, href, label }: { icon: MenuIcon, href: string, label: string }) => {
    const pathname = usePathname();
    const active = pathname === href;

    const router = useTransitionRouter();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        
        if (active) return;

        router.push(href);
    };

    return (
        <div className={styles.menuItem} style={active ? {
            borderBottom: '4px solid #2FACFF',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
        } : {}}>
            <a className={`${styles.menuContainer} ${active ? styles.active : ''}`} onClick={handleNavigation}>
                <i className={styles.itemIcon}
                   style={{
                       backgroundColor: active ? '#2FACFF' : 'var(--color-text-menu)',
                       mask: `url(${formatMenuIconPath(icon,
                           active ? MenuIconType.ACTIVE : MenuIconType.DEFAULT)}) no-repeat center`,
                   }}
                />
                <span className={styles.itemText}>{label}</span>
            </a>
        </div>
    );
};

export default function MenuComponent() {
    return (
        <div className={`${styles.menuItems} ${inter.className}`}>
            {menuItems.map(item => (
                <MenuItem key={item.href} {...item} />
            ))}
        </div>
    );
}