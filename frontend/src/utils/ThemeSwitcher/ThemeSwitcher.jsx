"use client"

import styles from './styles.module.scss'
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {SwitcherIconMapper} from "@/utils/ThemeSwitcher/languageIcons";

export default function ThemeSwitcher() {
    const [activeTheme, setActiveTheme] = useState('');
    const router = useRouter()

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
        setActiveTheme(newTheme);
    };

    return (
        <div className={styles.switch} onClick={toggleTheme}>
            <p className={styles.themeText}>THEME {activeTheme.toUpperCase()}</p>
            <button onClick={() => router.refresh()}>
                <Image src={SwitcherIconMapper[activeTheme]}
                       className={styles.themeIcon}
                       alt=""
                       width={32}
                       height={32}
                ></Image>
            </button>
        </div>
    );
}