'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { MenuIconMapper } from '@/components/foooter/menu/menuIcons.ts';
import styles from './styles.module.scss';
import { useTransitionRouter } from 'next-view-transitions';
import './theme.css';
import Link from 'next/link';

type MenuItem = {
    href: string;
    label: keyof typeof MenuIconMapper;
};

const menuItems: MenuItem[] = [
    { href: '/quiz', label: 'Quiz' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/home', label: 'Home' },
    { href: '/rating', label: 'Rating' },
    { href: '/profile', label: 'Profile' },
];

const MenuItem = ({ href, label }: { href: string, label: keyof typeof MenuIconMapper }) => {
    const pathname = usePathname();
    const active = pathname.startsWith(href);
    const router = 'startViewTransition' in document ? useTransitionRouter() : useRouter();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        if (pathname === href) return;

        router.push(href);
    };

    return (
        <div className={styles.menuItem} style={active ? {
            borderBottom: '4px solid #2FACFF',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
        } : {}}>
            <Link className={`${styles.menuContainer} ${active ? styles.active : ''}`} onClick={handleNavigation}
                  href={href}>
                <i
                    className={`${styles.itemIcon} ${active ? styles.itemIconActive : ''}`}
                    style={{
                        mask: `url(${MenuIconMapper[label].src}) no-repeat center center`,
                        backgroundColor: active ? '#2FACFF' : 'var(--color-text-menu)',
                    }}
                />
                <p className={styles.itemText}>{label}</p>
            </Link>
        </div>
    );
};

export default function MenuComponent() {
    return (
        <div className={styles.menuItems}>
            {menuItems.map(item => (
                <MenuItem key={item.href} {...item} />
            ))}
        </div>
    );
}