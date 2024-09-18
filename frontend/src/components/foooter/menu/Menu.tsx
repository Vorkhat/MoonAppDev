'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';
import { MenuIconMapper } from '@/components/foooter/menu/menuIcons.ts';
import styles from './styles.module.scss';
import { useTransitionRouter } from 'next-view-transitions';
import './theme.css';

type menuProps = {
    href: string;
    label: keyof typeof MenuIconMapper;
};

const menuItems: menuProps[] = [
    { href: '/quiz', label: 'Quiz' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/home', label: 'Home' },
    { href: '/rating', label: 'Rating' },
    { href: '/profile', label: 'Profile' },
];

const MenuItem = ({ href, label }: { href: string, label: keyof typeof MenuIconMapper }) => {
    const pathname = usePathname();
    const active = pathname.startsWith(href);
    const theme = localStorage.getItem('theme');
    const router = 'startViewTransition' in document ? useTransitionRouter() : useRouter();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        if (pathname === href) return;

        router.prefetch(['quiz', 'tasks', 'home', 'rating', 'profile'].includes(href) ? href : '/');
        router.push(href);
    };

    const emptySvg = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>';

    return (
        <div className={styles.menuItem} style={active ? {
            borderBottom: '4px solid #2FACFF',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
        } : {}}>
            <a className={`${styles.menuContainer} ${active ? styles.active : ''}`} onClick={handleNavigation}>
                <motion.img
                    src={emptySvg}
                    alt="/"
                    width={20}
                    height={20}
                    initial={{ opacity: active ? 1 : 0.6 }}
                    animate={{  opacity: active ? 1 : 0.6 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        mask: `url(${MenuIconMapper[label].src}) no-repeat center center`,
                        backgroundColor: active ? '#2FACFF' : (theme === 'dark' ? '#2FACFF' : '#0C0C0C'),
                    }}
                />
                <p className={styles.itemText}>{label}</p>
            </a>
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