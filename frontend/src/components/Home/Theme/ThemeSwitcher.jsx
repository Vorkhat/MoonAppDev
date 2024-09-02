"use client"

import './theme.css';
import styles from './styles.module.scss'
import {useEffect, useState} from "react";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

export default function ThemeSwitcher() {
    const [activeTheme, setActiveTheme] = useState('');

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme');
        if (currentTheme) {
            setActiveTheme(currentTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setActiveTheme(newTheme); // Обновляем состояние
    };

    return (
        <div className={styles.switch} onClick={toggleTheme}>
            <div className={`${styles.theme__text} ${inter.className}`}>THEME {activeTheme.toUpperCase()}</div>
            <div className={styles.theme__icon}></div>
        </div>
    );
}