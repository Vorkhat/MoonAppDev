"use client"

import './theme.css';
import styles from './styles.module.scss'
import {useEffect, useState} from "react";

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
            <p className={styles.themeText}>THEME {activeTheme.toUpperCase()}</p>
            <div className={styles.themeIcon}></div>
        </div>
    );
}